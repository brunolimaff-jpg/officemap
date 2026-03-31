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
import { bfs, directionBetween, isWalkable } from '@/lib/isoEngine';
import type { AvatarStatus } from '@/types';

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
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

const STEP_MS = 160;

const INITIAL_USERS: User[] = [
  {
    id: '1', name: 'Bruno',
    x: 14, y: 13, direction: 4,
    figure: 'hr-115-42.hd-190-1.ch-210-66.lg-270-82.sh-290-91',
    avatarStatus: 'idle',
  },
  ...specialists.map((s, i) => {
    const pos = specialistDeskPositions[s.id];
    return {
      id: s.id,
      name: s.name,
      x: pos.x,
      y: pos.y,
      direction: pos.direction,
      figure: `hr-893-45.hd-180-${(i % 5) + 1}.ch-210-66.lg-270-82.sh-290-91`,
      avatarStatus: 'idle' as AvatarStatus,
    };
  }),
];

// ─── RoomView memorizado — só re-renderiza quando usuários/mapa mudam ─────────
const MemoRoomView = memo(RoomView, (prev, next) => {
  if (prev.map !== next.map) return false;
  if (prev.onTileClick !== next.onTileClick) return false;
  if (prev.users.length !== next.users.length) return false;
  for (let i = 0; i < prev.users.length; i++) {
    const p = prev.users[i], n = next.users[i];
    if (
      p.x !== n.x || p.y !== n.y ||
      p.direction !== n.direction ||
      p.id !== n.id ||
      p.avatarStatus !== n.avatarStatus
    ) return false;
  }
  return true;
});

export default function HabboClient() {
  const [isHistoryOpen,     setIsHistoryOpen]     = useState(false);
  const [isConvocationOpen, setIsConvocationOpen] = useState(false);
  const [isChatLogOpen,     setIsChatLogOpen]     = useState(false);
  const [messages,          setMessages]          = useState<ChatMessage[]>([]);
  const [users,             setUsers]             = useState<User[]>(INITIAL_USERS);

  const { sessions, currentSessionId, saveSession, updateCurrentSession, loadSession, startNewSession } =
    useChatHistory();
  const cameraOffsetRef = useRef({ x: 0, y: 0 });

  const walkQueueRef = useRef<Array<{ x: number; y: number }>>([]);
  const walkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopWalking = useCallback(() => {
    if (walkTimerRef.current) {
      clearInterval(walkTimerRef.current);
      walkTimerRef.current = null;
    }
    walkQueueRef.current = [];
  }, []);

  useEffect(() => () => stopWalking(), [stopWalking]);

  // ─── Status helpers ───────────────────────────────────────────────────────
  const setAvatarStatus = useCallback((userId: string, status: AvatarStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, avatarStatus: status } : u));
  }, []);

  const resetSpecialistsToIdle = useCallback(() => {
    setUsers(prev => prev.map(u => u.id !== '1' ? { ...u, avatarStatus: 'idle' } : u));
  }, []);

  const presentUsers = users.map(u => ({
    id: u.id, name: u.name, color: SPECIALIST_COLORS[u.id] ?? '#64748B',
  }));

  // ─── Movimento passo a passo ──────────────────────────────────────────────
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
        setUsers(u =>
          u.map(usr => {
            if (usr.id !== '1') return usr;
            return {
              ...usr,
              x: next.x, y: next.y,
              direction: directionBetween(usr.x, usr.y, next.x, next.y),
              avatarStatus: 'walking',
            };
          })
        );
      }, STEP_MS);

      const first = path[0];
      return prev.map(u =>
        u.id === '1'
          ? { ...u, direction: directionBetween(u.x, u.y, first.x, first.y), avatarStatus: 'walking' }
          : u
      );
    });
  }, [stopWalking]);

  // ─── Mensagem ─────────────────────────────────────────────────────────────
  const handleSendMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = { id: Date.now().toString(), userId: '1', text, timestamp: Date.now() };
    const activeSpecialists = users.filter(u => u.id !== '1' && u.avatarStatus === 'summoned');
    const targets = activeSpecialists.length > 0 ? activeSpecialists : [users[1]].filter(Boolean);
    targets.forEach(u => setAvatarStatus(u.id, 'speaking'));
    const delay = Math.min(Math.max(text.length * 50, 2000), 8000);
    setTimeout(() => {
      targets.forEach(u =>
        setUsers(prev => prev.map(p =>
          p.id === u.id ? { ...p, avatarStatus: u.avatarStatus === 'speaking' ? 'idle' : p.avatarStatus } : p
        ))
      );
    }, delay);
    setMessages(prev => {
      const msgs = [...prev, newMessage];
      if (!currentSessionId) saveSession(msgs, ['Bruno']);
      else updateCurrentSession(msgs);
      return msgs;
    });
  }, [currentSessionId, saveSession, updateCurrentSession, users, setAvatarStatus]);

  // ─── Sessões ──────────────────────────────────────────────────────────────
  const handleLoadSession = useCallback((id: string) => {
    setMessages(loadSession(id));
    setIsHistoryOpen(false);
  }, [loadSession]);

  const handleNewSession = useCallback(() => {
    startNewSession(); setMessages([]); setIsHistoryOpen(false); resetSpecialistsToIdle();
  }, [startNewSession, resetSpecialistsToIdle]);

  // ─── Convocação ───────────────────────────────────────────────────────────
  const handleSummon = useCallback((selectedIds: string[]) => {
    stopWalking();
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
    setMessages(prev => [...prev, {
      id: Date.now().toString(), userId: 'system',
      text: `🏢 ${selectedIds.length} especialista(s) convocado(s) para a Sala de Reuniões.`,
      timestamp: Date.now(),
    }]);
    setIsChatLogOpen(true);
  }, [stopWalking]);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#0a0f1e] relative font-sans select-none">
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
