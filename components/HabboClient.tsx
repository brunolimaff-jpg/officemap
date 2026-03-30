import { useState, useEffect, useRef } from 'react';
import RoomView from './RoomView';
import BottomBar from './BottomBar';
import ChatBubbles from './ChatBubbles';
import HistoryWindow from './HistoryWindow';
import ConvocationPanel from './ConvocationPanel';
import ChatLogWindow from './ChatLogWindow';
import { specialists } from '@/data/specialists';
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

// 0 = Void
// 1 = Floor
// 4 = Wall
export const officeMap = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,0],
  [0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

export default function HabboClient() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConvocationOpen, setIsConvocationOpen] = useState(false);
  const [isChatLogOpen, setIsChatLogOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { sessions, currentSessionId, saveSession, updateCurrentSession, loadSession, startNewSession } = useChatHistory();
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Bruno', x: 5, y: 14, direction: 2, figure: 'hr-115-42.hd-190-1.ch-210-66.lg-270-82.sh-290-91' },
    { id: '2', name: 'Frank', x: 6, y: 16, direction: 4, figure: 'hr-893-45.hd-180-2.ch-210-66.lg-270-82.sh-290-91' },
    ...specialists.map((s, i) => ({
      id: s.id,
      name: s.name,
      x: 4 + (i % 4) * 3,
      y: 4 + Math.floor(i / 4) * 3,
      direction: 4,
      figure: `hr-893-45.hd-180-${(i % 5) + 1}.ch-210-66.lg-270-82.sh-290-91` // Randomish figures
    }))
  ]);

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: '1',
      text,
      timestamp: Date.now()
    };
    
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    if (!currentSessionId) {
      saveSession(newMessages, ['Bruno']); // Basic implementation, will improve when AI is added
    } else {
      updateCurrentSession(newMessages);
    }
  };

  const handleMoveUser = (x: number, y: number) => {
    // Check if tile is walkable
    const tileType = officeMap[y]?.[x];
    if (tileType !== 1) return;

    setUsers(prev => prev.map(u => {
      if (u.id === '1') {
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
      }
      return u;
    }));
  };

  const handleLoadSession = (id: string) => {
    const loadedMessages = loadSession(id);
    setMessages(loadedMessages);
    setIsHistoryOpen(false);
  };

  const handleNewSession = () => {
    startNewSession();
    setMessages([]);
    setIsHistoryOpen(false);
  };

  const handleSummon = (selectedIds: string[]) => {
    setUsers(prev => prev.map(u => {
      const index = selectedIds.indexOf(u.id);
      if (index !== -1) {
        // Move to central meeting table (x: 9-11, y: 9-11)
        const positions = [
          { x: 9, y: 9, dir: 2 },
          { x: 11, y: 11, dir: 6 },
          { x: 11, y: 9, dir: 4 },
          { x: 9, y: 11, dir: 0 },
          { x: 10, y: 8, dir: 4 }
        ];
        const pos = positions[index % positions.length];
        return {
          ...u,
          x: pos.x,
          y: pos.y,
          direction: pos.dir
        };
      }
      return u;
    }));
    
    // Also move Bruno to the meeting room
    setUsers(prev => prev.map(u => {
      if (u.id === '1') {
        return { ...u, x: 10, y: 12, direction: 0 }; // Facing up-right
      }
      return u;
    }));
    
    // Add a system message
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'system', // System
      text: `Convocou ${selectedIds.length} especialistas para a Sala de Reuniões.`,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    setIsChatLogOpen(true); // Open the chat log automatically
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative font-sans select-none">
      <RoomView users={users} map={officeMap} onTileClick={handleMoveUser} />
      <ChatBubbles messages={messages} users={users} />
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
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        onToggleConvocation={() => setIsConvocationOpen(!isConvocationOpen)}
        onToggleChatLog={() => setIsChatLogOpen(!isChatLogOpen)}
      />
    </div>
  );
}
