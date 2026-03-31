import { useState, useCallback, memo, useRef, useEffect } from 'react';
import RoomView from './RoomView';
import BottomBar from './BottomBar';
import ChatBubbles from './ChatBubbles';
import HistoryWindow from './HistoryWindow';
import ConvocationPanel from './ConvocationPanel';
import ChatLogWindow from './ChatLogWindow';
import { specialists, specialistDeskPositions, meetingPositions } from '@/data/specialists';
import { officeMap } from '@/data/map';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { bfs, directionBetween, isWalkable } from '@/lib/isoEngine';
import type { AvatarStatus, SpecialistId } from '@/types';

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  streaming?: boolean;
}

export interface User {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: number;
  figure: string;
  avatarStatus: AvatarStatus;
}

export { officeMap };

const SPECIALIST_COLORS: Record<string, string> = {
  satya: '#0078D4', uncle_bob: '#DC2626', karpathy: '#7C3AED', rogati: '#059669',
  osmani: '#F59E0B', whittaker: '#EF4444', dixon: '#06B6D4', dodds: '#EC4899',
  rauch: '#171717', rodrigues: '#16A34A', kozyrkov: '#8B5CF6', cagan: '#F97316',
  grove: '#64748B', '1': '#4A90E2',
};

const SPECIALIST_FIGURE_FALLBACK: Record<string, string> = {
  satya:     'hd-180-2.hr-3163-61.ch-3030-110.lg-3023-110.sh-906-110.cc-3007-110',
  uncle_bob: 'hd-180-10.hr-890-61.ch-3030-62.lg-3023-92.sh-906-92.ea-1406-62',
  karpathy:  'hd-180-1.hr-3163-92.ch-3114-113.lg-3023-92.sh-3114-92',
  rogati:    'hd-600-2.hr-3012-33.ch-3030-78.lg-3023-78.sh-906-78',
  osmani:    'hd-180-3.hr-3163-30.ch-3030-82.lg-3023-82.sh-906-82.ea-3168-82',
  whittaker: 'hd-180-4.hr-3163-16.ch-3030-62.lg-3023-62.sh-906-62.cc-3007-62',
  dixon:     'hd-180-5.hr-3163-61.ch-3030-110.lg-3023-110.sh-906-110.cc-3007-110',
  dodds:     'hd-180-1.hr-3012-16.ch-3114-75.lg-3023-90.sh-3114-75',
  rauch:     'hd-180-1.hr-3163-16.ch-3114-16.lg-3023-16.sh-3114-16',
  rodrigues: 'hd-180-7.hr-890-16.ch-3030-78.lg-3023-78.sh-906-78.cc-3007-78',
  kozyrkov:  'hd-600-1.hr-3012-30.ch-3030-113.lg-3023-113.sh-906-113.ea-1406-82',
  cagan:     'hd-180-8.hr-890-33.ch-3030-82.lg-3023-82.sh-906-82',
  grove:     'hd-180-10.hr-890-61.ch-3030-92.lg-3023-92.sh-906-92.cc-3007-92.ea-1406-61',
};

const STEP_MS = 160;

const INITIAL_USERS: User[] = [
  {
    id: '1', name: 'Bruno',
    x: 14, y: 13, direction: 4,
    figure: 'hr-115-42.hd-190-1.ch-210-66.lg-270-82.sh-290-91',
    avatarStatus: 'idle',
  },
  ...specialists.map((s) => {
    const pos = specialistDeskPositions[s.id];
    return {
      id: s.id,
      name: s.name,
      x: pos.x,
      y: pos.y,
      direction: pos.direction,
      figure: s.figure ?? SPECIALIST_FIGURE_FALLBACK[s.id] ?? 'hd-180-1.hr-3163-61.ch-3030-66.lg-3023-66.sh-906-66',
      avatarStatus: 'idle' as AvatarStatus,
    };
  }),
];

const MemoRoomView = memo(RoomView, (prev, next) => {
  if (prev.map !== next.map) return false;
  if (prev.onTileClick !== next.onTileClick) return false;
  if (prev.users.length !== next.users.length) return false;
  for (let i = 0; i < prev.users.length; i++) {
    const p = prev.users[i];
    const n = next.users[i];
    if (
      p.x !== n.x || p.y !== n.y ||
      p.direction !== n.direction ||
      p.id !== n.id ||
      p.avatarStatus !== n.avatarStatus
    ) return false;
  }
  return true;
});

// CSS global para animacoes dos avatares — injetado uma vez
const AVATAR_STYLES = `
  @keyframes avatarBounce {
    0%   { transform: translateY(0px); }
    50%  { transform: translateY(-3px); }
    100% { transform: translateY(0px); }
  }
  @keyframes avatarWalk {
    0%   { transform: translateY(0px) rotate(-1deg); }
    25%  { transform: translateY(-2px) rotate(0deg); }
    50%  { transform: translateY(0px) rotate(1deg); }
    75%  { transform: translateY(-2px) rotate(0deg); }
    100% { transform: translateY(0px) rotate(-1deg); }
  }
  @keyframes avatarSpeak {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.04); }
    100% { transform: scale(1); }
  }
  @keyframes shadowPulse {
    0%   { rx: 10; opacity: 0.22; }
    100% { rx: 8;  opacity: 0.15; }
  }
  @keyframes blinkCursor {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
`;

export default function HabboClient() {
  const [isHistoryOpen,     setIsHistoryOpen]     = useState(false);
  const [isConvocationOpen, setIsConvocationOpen] = useState(false);
  const [isChatLogOpen,     setIsChatLogOpen]     = useState(true);
  const [messages,          setMessages]          = useState<ChatMessage[]>([]);
  const [users,             setUsers]             = useState<User[]>(INITIAL_USERS);

  const summonedIdsRef    = useRef<SpecialistId[]>([]);
  const streamingMsgIdRef = useRef<string | null>(null);
  const cameraOffsetRef   = useRef({ x: 0, y: 0 });
  const walkQueueRef      = useRef<Array<{ x: number; y: number }>>([]);
  const walkTimerRef      = useRef<ReturnType<typeof setInterval> | null>(null);

  const { sessions, currentSessionId, saveSession, updateCurrentSession, loadSession, startNewSession } =
    useChatHistory();

  const stopWalking = useCallback(() => {
    if (walkTimerRef.current) {
      clearInterval(walkTimerRef.current);
      walkTimerRef.current = null;
    }
    walkQueueRef.current = [];
  }, []);

  useEffect(() => () => stopWalking(), [stopWalking]);

  const setAvatarStatus = useCallback((userId: string, status: AvatarStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, avatarStatus: status } : u));
  }, []);

  const resetSpecialistsToIdle = useCallback(() => {
    setUsers(prev => prev.map(u => u.id !== '1' ? { ...u, avatarStatus: 'idle' } : u));
  }, []);

  const presentUsers = users.map(u => ({
    id: u.id, name: u.name, color: SPECIALIST_COLORS[u.id] ?? '#64748B',
  }));

  const { sendMessage: sendGemini, stopStreaming } = useStreamingChat({
    onMessageStart: useCallback((role: 'assistant', specialistId?: SpecialistId) => {
      const id = `${Date.now()}-${specialistId ?? 'ai'}`;
      streamingMsgIdRef.current = id;
      setMessages(prev => [
        ...prev,
        { id, userId: specialistId ?? 'ai', text: '', timestamp: Date.now(), streaming: true },
      ]);
      if (specialistId) setAvatarStatus(specialistId, 'speaking');
      setIsChatLogOpen(true);
    }, [setAvatarStatus]),

    onMessageUpdate: useCallback((content: string) => {
      const id = streamingMsgIdRef.current;
      if (!id) return;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text: content } : m));
    }, []),

    onSpecialistDone: useCallback((specialistId?: SpecialistId) => {
      const id = streamingMsgIdRef.current;
      if (id) setMessages(prev => prev.map(m => m.id === id ? { ...m, streaming: false } : m));
      streamingMsgIdRef.current = null;
      if (specialistId) setAvatarStatus(specialistId, 'idle');
    }, [setAvatarStatus]),

    onMessageComplete: useCallback(() => {
      streamingMsgIdRef.current = null;
    }, []),

    onError: useCallback((error: string) => {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), userId: 'system', text: `⚠️ Erro: ${error}`, timestamp: Date.now() },
      ]);
      resetSpecialistsToIdle();
    }, [resetSpecialistsToIdle]),
  });

  const handleMoveUser = useCallback((tx: number, ty: number) => {
    if (!isWalkable(officeMap, tx, ty)) return;
    setUsers(prev => {
      const bruno = prev.find(u => u.id === '1');
      if (!bruno) return prev;
      stopWalking();
      const path = bfs(officeMap, bruno.x, bruno.y, tx, ty);
      if (path.length === 0) return prev;
      walkQueueRef.current = path;
      walkTimerRef.current = setInterval(() => {
        const next = walkQueueRef.current.shift();
        if (!next) {
          if (walkTimerRef.current) clearInterval(walkTimerRef.current);
          walkTimerRef.current = null;
          setUsers(u => u.map(usr => usr.id === '1' ? { ...usr, avatarStatus: 'idle' } : usr));
          return;
        }
        setUsers(u => u.map(usr => {
          if (usr.id !== '1') return usr;
          return {
            ...usr,
            x: next.x, y: next.y,
            direction: directionBetween(usr.x, usr.y, next.x, next.y),
            avatarStatus: 'walking',
          };
        }));
      }, STEP_MS);
      const first = path[0];
      return prev.map(u =>
        u.id === '1'
          ? { ...u, direction: directionBetween(u.x, u.y, first.x, first.y), avatarStatus: 'walking' }
          : u
      );
    });
  }, [stopWalking]);

  const handleSendMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), userId: '1', text, timestamp: Date.now() };
    setMessages(prev => {
      const msgs = [...prev, userMsg];
      if (!currentSessionId) saveSession(msgs, ['Bruno']);
      else updateCurrentSession(msgs);
      return msgs;
    });
    const summoned  = summonedIdsRef.current;
    const sessionId = currentSessionId ?? Date.now().toString();
    const history   = messages.map(m => ({
      id: m.id,
      role: m.userId === '1' ? ('user' as const) : ('assistant' as const),
      content: m.text,
      specialistId: m.userId !== '1' && m.userId !== 'system' ? (m.userId as SpecialistId) : undefined,
    }));
    history.push({ id: userMsg.id, role: 'user', content: text, specialistId: undefined });
    if (summoned.length >= 2) {
      sendGemini('group', { specialistIds: summoned, userMessage: text }, sessionId);
    } else {
      const targetId: SpecialistId = summoned[0] ?? 'satya';
      sendGemini('single', { specialistId: targetId, messages: history }, sessionId);
    }
  }, [messages, currentSessionId, saveSession, updateCurrentSession, sendGemini]);

  const handleLoadSession = useCallback((id: string) => {
    setMessages(loadSession(id));
    setIsHistoryOpen(false);
  }, [loadSession]);

  const handleNewSession = useCallback(() => {
    stopStreaming();
    startNewSession();
    setMessages([]);
    setIsHistoryOpen(false);
    resetSpecialistsToIdle();
    summonedIdsRef.current = [];
  }, [startNewSession, resetSpecialistsToIdle, stopStreaming]);

  const handleSummon = useCallback((selectedIds: string[]) => {
    stopWalking();
    summonedIdsRef.current = selectedIds as SpecialistId[];
    setUsers(prev => {
      const withSpec = prev.map(u => {
        const idx = selectedIds.indexOf(u.id);
        if (idx !== -1) {
          const pos = meetingPositions[idx % meetingPositions.length];
          return { ...u, x: pos.x, y: pos.y, direction: pos.dir, avatarStatus: 'summoned' as AvatarStatus };
        }
        return u.id !== '1' ? { ...u, avatarStatus: 'idle' as AvatarStatus } : u;
      });
      return withSpec.map(u =>
        u.id === '1' ? { ...u, x: 14, y: 10, direction: 0, avatarStatus: 'idle' as AvatarStatus } : u
      );
    });
    const names = selectedIds
      .map(id => specialists.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    setMessages(prev => [{
      id: Date.now().toString(), userId: 'system',
      text: `🏢 Convocados para Sala de Reuniões: ${names}.`,
      timestamp: Date.now(),
    }, ...prev]);
    setIsChatLogOpen(true);
  }, [stopWalking]);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#0a0f1e] relative font-sans select-none">
      {/* CSS de animacoes */}
      <style>{AVATAR_STYLES}</style>

      {/* Vinheta de borda */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{ boxShadow: 'inset 0 0 0 4px #111, inset 0 0 0 6px #222, inset 0 0 24px rgba(0,0,0,0.7)' }}
      />

      <MemoRoomView users={users} map={officeMap} onTileClick={handleMoveUser} />
      <ChatBubbles messages={messages} users={users} cameraOffsetRef={cameraOffsetRef} />

      {isHistoryOpen && (
        <HistoryWindow
          onClose={() => setIsHistoryOpen(false)}
          sessions={sessions}
          onLoadSession={handleLoadSession}
          onNewSession={handleNewSession}
        />
      )}
      {isConvocationOpen && (
        <ConvocationPanel onClose={() => setIsConvocationOpen(false)} onSummon={handleSummon} />
      )}
      {isChatLogOpen && (
        <ChatLogWindow onClose={() => setIsChatLogOpen(false)} messages={messages} users={users} />
      )}

      <BottomBar
        onSendMessage={handleSendMessage}
        onToggleHistory={() => setIsHistoryOpen(p => !p)}
        onToggleConvocation={() => setIsConvocationOpen(p => !p)}
        onToggleChatLog={() => setIsChatLogOpen(p => !p)}
        presentUsers={presentUsers}
      />
    </div>
  );
}
