import { useState, useCallback } from 'react';
import { Message, SpecialistId } from '@/types';

type SessionMemory = Record<string, Message[]>;

export function useSessionMemory() {
  const [memory, setMemory] = useState<SessionMemory>({});

  const getMessages = useCallback((key: string) => {
    return memory[key] || [];
  }, [memory]);

  const addMessage = useCallback((key: string, message: Message) => {
    setMemory((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), message],
    }));
  }, []);

  const updateLastMessage = useCallback((key: string, content: string) => {
    setMemory((prev) => {
      const messages = prev[key] || [];
      if (messages.length === 0) return prev;
      
      const lastMessage = messages[messages.length - 1];
      const updatedMessages = [...messages.slice(0, -1), { ...lastMessage, content }];
      
      return {
        ...prev,
        [key]: updatedMessages,
      };
    });
  }, []);

  const clearMessages = useCallback((key: string) => {
    setMemory((prev) => {
      const newMemory = { ...prev };
      delete newMemory[key];
      return newMemory;
    });
  }, []);

  return { getMessages, addMessage, updateLastMessage, clearMessages };
}
