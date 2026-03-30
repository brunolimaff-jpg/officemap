import { useState, useEffect } from 'react';
import { ChatMessage } from '@/components/HabboClient';

export interface ChatSession {
  id: string;
  date: number;
  title: string;
  messages: ChatMessage[];
  participants: string[];
}

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('habbo_chat_history');
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
  }, []);

  // Save to local storage whenever sessions change
  useEffect(() => {
    localStorage.setItem('habbo_chat_history', JSON.stringify(sessions));
  }, [sessions]);

  const saveSession = (messages: ChatMessage[], participants: string[]) => {
    if (messages.length === 0) return;

    const newSession: ChatSession = {
      id: Date.now().toString(),
      date: Date.now(),
      title: `Sessão com ${participants.join(', ')}`,
      messages,
      participants,
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const updateCurrentSession = (messages: ChatMessage[]) => {
    if (!currentSessionId) return;
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId ? { ...s, messages } : s
    ));
  };

  const loadSession = (id: string) => {
    setCurrentSessionId(id);
    const session = sessions.find(s => s.id === id);
    return session ? session.messages : [];
  };

  const startNewSession = () => {
    setCurrentSessionId(null);
  };

  return {
    sessions,
    currentSessionId,
    saveSession,
    updateCurrentSession,
    loadSession,
    startNewSession
  };
}
