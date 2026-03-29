import { useState, useCallback, useRef } from 'react';
import { Message, SpecialistId, StreamStatus, Specialist } from '@/types';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { specialists, getSpecialistPrompt } from '@/data/specialists';

interface UseStreamingChatProps {
  onMessageStart?: (role: 'assistant', specialistId?: SpecialistId) => void;
  onMessageUpdate?: (content: string) => void;
  onSpecialistDone?: (specialistId?: SpecialistId) => void;
  onMessageComplete?: () => void;
  onError?: (error: string) => void;
}

export function useStreamingChat({
  onMessageStart,
  onMessageUpdate,
  onSpecialistDone,
  onMessageComplete,
  onError,
}: UseStreamingChatProps = {}) {
  const [status, setStatus] = useState<StreamStatus>({ status: 'idle' });
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setStatus({ status: 'idle' });
    }
  }, []);

  const sendMessage = useCallback(
    async (
      type: 'single' | 'group',
      payload: any,
      sessionId: string
    ) => {
      stopStreaming();
      
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      
      setStatus({ status: 'loading' });

      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error('Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY.');
        }

        const ai = new GoogleGenAI({ apiKey });
        setStatus({ status: 'streaming' });

        if (type === 'single') {
          const { specialistId, messages } = payload;
          const specialist = specialists.find((s) => s.id === specialistId);
          if (!specialist) throw new Error('Specialist not found');

          onMessageStart?.('assistant', specialistId);
          
          const systemInstruction = getSpecialistPrompt(specialist);
          const formattedMessages = messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          }));

          const responseStream = await ai.models.generateContentStream({
            model: 'gemini-3.1-pro-preview',
            contents: formattedMessages,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          let fullContent = '';
          for await (const chunk of responseStream) {
            const c = chunk as GenerateContentResponse;
            if (c.text) {
              fullContent += c.text;
              onMessageUpdate?.(fullContent);
            }
            if (abortController.signal.aborted) break;
          }
          
          onSpecialistDone?.(specialistId);
        } else {
          // Group chat logic
          const { specialistIds, userMessage } = payload;
          const selectedSpecialists = specialistIds
            .map((id: SpecialistId) => specialists.find((s) => s.id === id))
            .filter((s: Specialist | undefined): s is Specialist => s !== undefined);

          let context = `O usuário perguntou: "${userMessage}"\n\n`;

          for (const specialist of selectedSpecialists) {
            if (abortController.signal.aborted) break;

            onMessageStart?.('assistant', specialist.id);
            
            const systemInstruction = getSpecialistPrompt(specialist);
            const prompt = `${context}\nAgora é sua vez de responder.`;

            const responseStream = await ai.models.generateContentStream({
              model: 'gemini-3.1-pro-preview',
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              config: {
                systemInstruction,
                temperature: 0.7,
              },
            });

            let specialistContent = '';
            for await (const chunk of responseStream) {
              const c = chunk as GenerateContentResponse;
              if (c.text) {
                specialistContent += c.text;
                onMessageUpdate?.(specialistContent);
              }
              if (abortController.signal.aborted) break;
            }

            context += `${specialist.name} respondeu: "${specialistContent}"\n\n`;
            onSpecialistDone?.(specialist.id);
          }
        }

        onMessageComplete?.();
        setStatus({ status: 'success' });
      } catch (error: any) {
        if (error.name === 'AbortError') {
          setStatus({ status: 'idle' });
        } else {
          console.error('Gemini API Error:', error);
          const errorMessage = error.message || 'An unexpected error occurred.';
          setStatus({ status: 'error', error: errorMessage });
          onError?.(errorMessage);
        }
      } finally {
        abortControllerRef.current = null;
      }
    },
    [stopStreaming, onMessageStart, onMessageUpdate, onSpecialistDone, onMessageComplete, onError]
  );

  return { sendMessage, stopStreaming, status };
}
