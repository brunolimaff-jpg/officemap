import React, { useState, useEffect } from 'react';
import { ChatMessage, User } from './HabboClient';

interface ChatBubblesProps {
  messages: ChatMessage[];
  users: User[];
}

interface ActiveBubble extends ChatMessage {
  yOffset: number;
  opacity: number;
}

export default function ChatBubbles({ messages, users }: ChatBubblesProps) {
  const [activeBubbles, setActiveBubbles] = useState<ActiveBubble[]>([]);

  // When a new message arrives, add it and push others up
  useEffect(() => {
    if (messages.length === 0) return;
    
    const latestMsg = messages[messages.length - 1];
    
    setActiveBubbles(prev => {
      // Move existing bubbles up
      const updated = prev.map(b => ({
        ...b,
        yOffset: b.yOffset + 30, // Move up by 30px
        opacity: b.yOffset > 150 ? 0 : 1 // Fade out if too high
      })).filter(b => b.opacity > 0); // Remove faded ones

      return [...updated, { ...latestMsg, yOffset: 0, opacity: 1 }];
    });

    // Auto-remove after 5 seconds
    const timer = setTimeout(() => {
      setActiveBubbles(prev => prev.filter(b => b.id !== latestMsg.id));
    }, 5000);

    return () => clearTimeout(timer);
  }, [messages]);

  // Helper to find user screen position
  const getUserScreenX = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return window.innerWidth / 2;
    
    const TILE_W = 64;
    const offsetX = window.innerWidth / 2;
    // We only need X for the bubble horizontal placement
    return offsetX + (user.x - user.y) * (TILE_W / 2);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {activeBubbles.map(bubble => {
        const user = users.find(u => u.id === bubble.userId);
        const xPos = getUserScreenX(bubble.userId);
        
        return (
          <div
            key={bubble.id}
            className="absolute flex items-center transition-all duration-300 ease-out"
            style={{
              left: xPos,
              bottom: 120 + bubble.yOffset, // Base height above avatar + offset
              transform: 'translateX(-50%)',
              opacity: bubble.opacity,
            }}
          >
            <div className="bg-white border-2 border-black rounded-lg px-3 py-1 text-black text-xs font-sans whitespace-nowrap shadow-md flex items-center">
              <span className="font-bold mr-1">{user?.name}:</span>
              <span>{bubble.text}</span>
            </div>
            {/* Bubble tail */}
            {bubble.yOffset === 0 && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b-2 border-r-2 border-black transform rotate-45" />
            )}
          </div>
        );
      })}
    </div>
  );
}
