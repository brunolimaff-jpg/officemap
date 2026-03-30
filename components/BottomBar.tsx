import React, { useState } from 'react';
import { MessageSquare, Navigation, ShoppingCart, User, Users, Clock } from 'lucide-react';

interface BottomBarProps {
  onSendMessage: (text: string) => void;
  onToggleHistory: () => void;
  onToggleConvocation: () => void;
  onToggleChatLog: () => void;
}

export default function BottomBar({ onSendMessage, onToggleHistory, onToggleConvocation, onToggleChatLog }: BottomBarProps) {
  const [chatInput, setChatInput] = useState('');

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onSendMessage(chatInput);
      setChatInput('');
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#1A1A1A] border-t-2 border-[#333333] flex items-center px-2 z-50 habbo-ui-bar shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
      
      {/* Left Icons */}
      <div className="flex space-x-1 mr-4">
        <button className="habbo-btn w-10 h-10 flex items-center justify-center bg-[#2A2A2A] border-2 border-[#444] border-b-[#111] border-r-[#111] active:border-t-[#111] active:border-l-[#111] active:border-b-[#444] active:border-r-[#444]">
          <User size={20} color="#FFF" />
        </button>
        <button 
          onClick={onToggleHistory}
          className="habbo-btn w-10 h-10 flex items-center justify-center bg-[#2A2A2A] border-2 border-[#444] border-b-[#111] border-r-[#111] active:border-t-[#111] active:border-l-[#111] active:border-b-[#444] active:border-r-[#444]"
          title="Histórico de Conversas"
        >
          <Clock size={20} color="#FFF" />
        </button>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleChatSubmit} className="flex-1 flex items-center max-w-2xl">
        <div className="flex-1 bg-white h-8 rounded flex items-center px-2 border-2 border-[#444] border-t-[#111] border-l-[#111]">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full h-full outline-none text-black text-sm font-sans"
            placeholder="Clique aqui para falar..."
            maxLength={100}
          />
        </div>
        <button type="submit" className="ml-2 px-4 h-8 bg-[#4A90E2] text-white font-bold text-xs rounded border-2 border-[#7AB8FF] border-b-[#2A60A2] border-r-[#2A60A2] active:border-t-[#2A60A2] active:border-l-[#2A60A2] active:border-b-[#7AB8FF] active:border-r-[#7AB8FF]">
          Falar
        </button>
      </form>

      {/* Right Icons */}
      <div className="flex space-x-1 ml-auto">
        <button 
          onClick={onToggleChatLog}
          className="habbo-btn w-10 h-10 flex items-center justify-center bg-[#2A2A2A] border-2 border-[#444] border-b-[#111] border-r-[#111] active:border-t-[#111] active:border-l-[#111] active:border-b-[#444] active:border-r-[#444]"
          title="Painel de Discussão"
        >
          <MessageSquare size={20} color="#FFF" />
        </button>
        <button 
          onClick={onToggleConvocation}
          className="habbo-btn w-10 h-10 flex items-center justify-center bg-[#2A2A2A] border-2 border-[#444] border-b-[#111] border-r-[#111] active:border-t-[#111] active:border-l-[#111] active:border-b-[#444] active:border-r-[#444]"
          title="Convocar Especialistas"
        >
          <Users size={20} color="#FFF" />
        </button>
        <button className="habbo-btn w-10 h-10 flex items-center justify-center bg-[#2A2A2A] border-2 border-[#444] border-b-[#111] border-r-[#111]">
          <ShoppingCart size={20} color="#FFF" />
        </button>
      </div>
    </div>
  );
}
