import React, { useState } from 'react';
import { MessageSquare, Users, Clock, Building2 } from 'lucide-react';

interface BottomBarProps {
  onSendMessage: (text: string) => void;
  onToggleHistory: () => void;
  onToggleConvocation: () => void;
  onToggleChatLog: () => void;
  presentUsers?: { id: string; name: string; color: string }[];
}

export default function BottomBar({
  onSendMessage,
  onToggleHistory,
  onToggleConvocation,
  onToggleChatLog,
  presentUsers = [],
}: BottomBarProps) {
  const [chatInput, setChatInput] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [inputFlash, setInputFlash] = useState(false);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
    // Flash de feedback visual — estilo Habbo
    setInputFlash(true);
    setTimeout(() => setInputFlash(false), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">

      {/* Barra de presença — avatares na sala */}
      {presentUsers.length > 0 && (
        <div className="absolute bottom-14 left-2 flex items-center gap-1 bg-black/70 rounded-t px-2 py-1">
          <span className="text-[8px] text-slate-400 font-pixel mr-1">NA SALA:</span>
          {presentUsers.slice(0, 8).map(u => (
            <div
              key={u.id}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-pixel font-bold text-white"
              style={{ backgroundColor: u.color }}
              title={u.name}
            >
              {u.name[0]}
            </div>
          ))}
        </div>
      )}

      {/* Card de perfil do Bruno */}
      {showProfile && (
        <div className="absolute bottom-16 left-2 bg-[#1E293B] border-2 border-[#334155] rounded-lg p-3 w-48 shadow-xl z-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#4A90E2] flex items-center justify-center text-white font-pixel text-xs">B</div>
            <div>
              <div className="text-white text-xs font-pixel font-bold">Bruno Lima</div>
              <div className="text-slate-400 text-[9px] font-pixel">Economista · Agronegócio</div>
            </div>
          </div>
          <div className="border-t border-[#334155] pt-2">
            <div className="text-[9px] text-slate-400 font-pixel">Cuiabá, MT · Tech & ERP</div>
            <div className="text-[9px] text-slate-400 font-pixel mt-0.5">Board Room Host</div>
          </div>
        </div>
      )}

      {/* HUD principal */}
      <div className="h-14 bg-[#1A1A1A] border-t-2 border-[#333333] flex items-center px-2 habbo-ui-bar shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">

        {/* Botões esquerda */}
        <div className="flex space-x-1 mr-4">
          {/* Perfil */}
          <button
            onClick={() => setShowProfile(p => !p)}
            className={`habbo-btn w-10 h-10 flex items-center justify-center border-2 transition-colors ${
              showProfile
                ? 'bg-[#4A90E2] border-[#7AB8FF] border-b-[#2A60A2] border-r-[#2A60A2]'
                : 'bg-[#2A2A2A] border-[#444] border-b-[#111] border-r-[#111]'
            }`}
            title="Meu Perfil"
          >
            <Building2 size={18} color="#FFF" />
          </button>
          {/* Histórico */}
          <button
            onClick={onToggleHistory}
            className="habbo-btn w-10 h-10 flex items-center justify-center bg-[#2A2A2A] border-2 border-[#444] border-b-[#111] border-r-[#111] active:border-t-[#111] active:border-l-[#111] active:border-b-[#444] active:border-r-[#444]"
            title="Histórico de Conversas"
          >
            <Clock size={18} color="#FFF" />
          </button>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleChatSubmit} className="flex-1 flex items-center max-w-2xl">
          <div
            className={`flex-1 bg-white h-8 rounded flex items-center px-2 border-2 border-t-[#111] border-l-[#111] border-b-[#444] border-r-[#444] transition-all duration-150 ${
              inputFlash ? 'ring-2 ring-[#4A90E2]' : ''
            }`}
          >
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full outline-none text-black text-sm font-pixel"
              placeholder="Clique aqui para falar..."
              maxLength={100}
            />
          </div>
          <button
            type="submit"
            className="ml-2 px-4 h-8 bg-[#4A90E2] text-white font-bold text-xs font-pixel rounded border-2 border-[#7AB8FF] border-b-[#2A60A2] border-r-[#2A60A2] active:border-t-[#2A60A2] active:border-l-[#2A60A2] active:border-b-[#7AB8FF] active:border-r-[#7AB8FF]"
          >
            Falar
          </button>
        </form>

        {/* Botões direita */}
        <div className="flex space-x-1 ml-auto">
          <button
            onClick={onToggleChatLog}
            className="habbo-btn w-10 h-10 flex items-center justify-center bg-[#2A2A2A] border-2 border-[#444] border-b-[#111] border-r-[#111] active:border-t-[#111] active:border-l-[#111] active:border-b-[#444] active:border-r-[#444]"
            title="Painel de Discussão"
          >
            <MessageSquare size={18} color="#FFF" />
          </button>
          <button
            onClick={onToggleConvocation}
            className="habbo-btn w-10 h-10 flex items-center justify-center bg-[#2A2A2A] border-2 border-[#444] border-b-[#111] border-r-[#111] active:border-t-[#111] active:border-l-[#111] active:border-b-[#444] active:border-r-[#444]"
            title="Convocar Especialistas"
          >
            <Users size={18} color="#FFF" />
          </button>
        </div>
      </div>
    </div>
  );
}
