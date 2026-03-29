import { Message } from '@/types';
import { specialists } from '@/data/specialists';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MessageStreamProps {
  messages: Message[];
  isStreaming: boolean;
}

export function MessageStream({ messages, isStreaming }: MessageStreamProps) {
  return (
    <div className="flex flex-col gap-4 p-2">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        const specialist = msg.specialistId ? specialists.find(s => s.id === msg.specialistId) : null;
        
        return (
          <div
            key={msg.id || idx}
            className={cn(
              'flex w-full animate-[float-up-ui_0.3s_ease-out_forwards]',
              isUser ? 'justify-end' : 'justify-start'
            )}
            style={{ animationFillMode: 'forwards' }}
          >
            <div
              className={cn(
                'max-w-[85%] habbo-speech',
                isUser ? 'bg-[#E8E8E8] ml-auto' : 'bg-white'
              )}
            >
              {!isUser && specialist && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold" style={{ color: specialist.color }}>
                    {specialist.name}:
                  </span>
                </div>
              )}
              {isUser && (
                <div className="flex items-center gap-2 mb-1 justify-end">
                  <span className="font-bold text-black">
                    Bruno:
                  </span>
                </div>
              )}
              
              <div className="prose prose-sm max-w-none font-sans text-xs leading-tight text-black break-words prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        );
      })}
      
      {isStreaming && (
        <div className="flex justify-start animate-[float-up-ui_0.3s_ease-out_forwards]">
          <div className="habbo-speech flex items-center gap-1 h-8">
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
}
