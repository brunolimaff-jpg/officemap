import { useState, useCallback, memo, useRef } from 'react';
import RoomView from './RoomView';
import BottomBar from './BottomBar';
import ChatBubbles from './ChatBubbles';
import HistoryWindow from './HistoryWindow';
import ConvocationPanel from './ConvocationPanel';
import ChatLogWindow from './ChatLogWindow';
import { specialists, specialistDeskPositions, meetingPositions } from '@/data/specialists';
import { officeMap } from '@/data/map';
import { useChatHistory } from '@/hooks/useChatHistory';

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
}

export { officeMap };

const SPECIALIST_COLORS: Record<string, string> = {
  satya: '#0078D4', uncle_bob: '#DC2626', karpathy: '#7C3AED', rogati: '#059669',
  osmani: '#F59E0B', whittaker: '#EF4444', dixon: '#06B6D4', dodds: '#EC4899',
  rauch: '#171717', rodrigues: '#16A34A', kozyrkov: '#8B5CF6', cagan: '#F97316',
  grove: '#64748B', '1': '#4A90E2',
};

const WALKABLE = new Set([1, 2, 3, 6, 7]);

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Bruno', x: 14, y: 13, direction: 4, figure: 'hr-115-42.hd-190-1.ch-210-66.lg-270-82.sh-290-91' },
  ...specialists.map((s, i) => {
    const pos = specialistDeskPositions[s.id];
    return {
      id: s.id,
      name: s.name,
      x: pos.x,
      y: pos.y,
      direction: pos.direction,
      figure: `hr-893-45.hd-180-${(i % 5) + 1}.ch-210-66.lg-270-82.sh-290-91`,
    };
  }),
];

// ─── RoomView isolado com memo — nunca re-renderiza por mensagem/janela ────────
const MemoRoomView = memo(RoomView, (prev, next) => {
  // Re-renderiza apenas se users ou map mudarem de verdade
  if (prev.map !== next.map) return false;
  if (prev.onTileClick !== next.onTileClick) return false;
  if (prev.users.length !== next.users.length) return false;
  for (let i = 0; i < prev.users.length; i++) {
    const p = prev.users[i], n = next.users[i];
    if (p.x !== n.x || p.y !== n.y || p.direction !== n.direction || p.id !== n.id) return false;
  }
  return true; // props iguais → não re-renderiza
});

export default function HabboClient() {
  const [isHistoryOpen, setIsHistoryOpen]       = useState(false);
  const [isConvocationOpen, setIsConvocationOpen] = useState(false);
  const [isChatLogOpen, setIsChatLogOpen]       = useState(false);
  const [messages, setMessages]                 = useState<ChatMessage[]>([]);
  const [users, setUsers]                       = useState<User[]>(INITIAL_USERS);

  const { sessions, currentSessionId, saveSession, updateCurrentSession, loadSession, startNewSession } = useChatHistory();

  // ─── cameraOffsetRef compartilhado com ChatBubbles para posição correta ───────
  const cameraOffsetRef = useRef({ x: 0, y: 0 });

  const presentUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    color: SPECIALIST_COLORS[u.id] ?? '#64748B',
  }));

  const handleSendMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: '1',
      text,
      timestamp: Date.now(),
    };
    setMessages(prev => {
      const newMessages = [...prev, newMessage];
      if (!currentSessionId) {
        saveSession(newMessages, ['Bruno']);
      } else {
        updateCurrentSession(newMessages);
      }
      return newMessages;
    });
  }, [currentSessionId, saveSession, updateCurrentSession]);

  const handleMoveUser = useCallback((x: number, y: number) => {
    const tileType = officeMap[y]?.[x];
    if (!WALKABLE.has(tileType)) return;
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== '1') return u;
        let dir = u.direction;
        if (x > u.x && y === u.y) dir = 2;
        else if (x < u.x && y === u.y) dir = 6;
        else if (y > u.y && x === u.x) dir = 4;
        else if (y < u.y && x === u.x) dir = 0;
        else if (x > u.x && y > u.y) dir = 3;
        else if (x > u.x && y < u.y) dir = 1;
        else if (x < u.x && y > u.y) dir = 5;
        else if (x < u.x && y < u.y) dir = 7;
        return { ...u, x, y, direction: dir };
      })
    );
  }, []);

  const handleLoadSession = useCallback((id: string) => {
    const loadedMessages = loadSession(id);
    setMessages(loadedMessages);
    setIsHistoryOpen(false);
  }, [loadSession]);

  const handleNewSession = useCallback(() => {
    startNewSession();
    setMessages([]);
    setIsHistoryOpen(false);
  }, [startNewSession]);

  const handleSummon = useCallback((selectedIds: string[]) => {
    setUsers(prev => {
      const withSpecialists = prev.map(u => {
        const index = selectedIds.indexOf(u.id);
        if (index !== -1) {
          const pos = meetingPositions[index % meetingPositions.length];
          return { ...u, x: pos.x, y: pos.y, direction: pos.dir };
        }
        return u;
      });
      return withSpecialists.map(u =>
        u.id === '1' ? { ...u, x: 14, y: 10, direction: 0 } : u
      );
    });
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'system',
      text: `🏢 ${selectedIds.length} especialista(s) convocado(s) para a Sala de Reuniões.`,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    setIsChatLogOpen(true);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative font-sans select-none">
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          boxShadow: 'inset 0 0 0 4px #111, inset 0 0 0 6px #222, inset 0 0 24px rgba(0,0,0,0.7)',
        }}
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
        <ConvocationPanel
          onClose={() => setIsConvocationOpen(false)}
          onSummon={handleSummon}
        />
      )}
      {isChatLogOpen && (
        <ChatLogWindow
          onClose={() => setIsChatLogOpen(false)}
          messages={messages}
          users={users}
        />
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
