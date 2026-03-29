'use client';

import { useState, useRef, useEffect } from 'react';
import { SpecialistId, Message, StreamStatus } from '@/types';
import { specialists } from '@/data/specialists';
import { MessageStream } from './MessageStream';
import { X, Send, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConvocationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: SpecialistId[];
  messages: Message[];
  onSendMessage: (content: string) => void;
  streamStatus: StreamStatus;
  stopStreaming: () => void;
}

export function ConvocationPanel({
  isOpen,
  onClose,
  selectedIds,
  messages,
  onSendMessage,
  streamStatus,
  stopStreaming,
}: ConvocationPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isStreaming = streamStatus.status === 'loading' || streamStatus.status === 'streaming';
  const isGroup = selectedIds.length > 1;

  const selectedSpecialists = selectedIds
    .map((id) => specialists.find((s) => s.id === id))
    .filter(Boolean);

  const title = isGroup
    ? `Sessão em Grupo (${selectedIds.length})`
    : selectedSpecialists[0]?.name || 'Sessão';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 bottom-4 w-[400px] habbo-window z-40 flex flex-col transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-[120%]'
      )}
    >
      {/* Header */}
      <div className="habbo-header">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {selectedSpecialists.map((s) => (
              <div
                key={s!.id}
                className="w-4 h-4 rounded-full border border-black flex items-center justify-center text-white font-bold text-[8px]"
                style={{ backgroundColor: s!.color }}
                title={s!.name}
              >
                {s!.name.charAt(0)}
              </div>
            ))}
          </div>
          <span>{title}</span>
        </div>
        <button onClick={onClose} className="hover:text-red-400">
          <X size={12} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-white p-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
            <div className="font-pixel text-[10px] uppercase tracking-widest mb-4 text-black">
              Sessão Iniciada
            </div>
            <p className="font-sans text-xs">
              {isGroup
                ? 'Faça uma pergunta para iniciar o debate entre os especialistas.'
                : `Olá Bruno. O que você gostaria de discutir com ${selectedSpecialists[0]?.name}?`}
            </p>
          </div>
        ) : (
          <MessageStream messages={messages} isStreaming={isStreaming} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error State */}
      {streamStatus.status === 'error' && (
        <div className="bg-red-100 border-t-2 border-black p-2 flex items-start gap-2 text-red-800 text-xs font-sans">
          <AlertCircle className="shrink-0 mt-0.5" size={14} />
          <div>
            <p className="font-bold">Erro de Conexão</p>
            <p>{streamStatus.error}</p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-2 bg-[#E8E8E8] border-t-2 border-black rounded-b-lg">
        <form onSubmit={handleSubmit} className="relative flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite algo..."
            className="flex-1 bg-white border-2 border-black rounded p-2 text-black font-sans text-sm resize-none focus:outline-none focus:ring-0"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex flex-col gap-1 justify-end">
            {isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                className="habbo-button !px-2 !py-1 text-red-600"
                title="Parar"
              >
                <div className="w-3 h-3 bg-current rounded-sm" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="habbo-button !px-2 !py-1 disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
