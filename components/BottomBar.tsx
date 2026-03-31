import React, { useState } from 'react';

interface BottomBarProps {
  onSendMessage: (text: string) => void;
  onToggleHistory: () => void;
  onToggleConvocation: () => void;
  onToggleChatLog: () => void;
  presentUsers?: { id: string; name: string; color: string }[];
}

const PixelIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    history: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="3" width="12" height="12" rx="1" fill="#B45309" />
        <rect x="4" y="4" width="10" height="10" rx="1" fill="#F59E0B" />
        <rect x="6" y="7" width="6" height="1" fill="#7C3F00" />
        <rect x="6" y="9" width="5" height="1" fill="#7C3F00" />
        <rect x="6" y="11" width="4" height="1" fill="#7C3F00" />
      </svg>
    ),
    profile: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="3" width="12" height="12" rx="1" fill="#1E40AF" />
        <rect x="4" y="4" width="10" height="10" rx="1" fill="#3B82F6" />
        <rect x="7" y="5" width="4" height="4" rx="1" fill="#BFDBFE" />
        <rect x="5" y="10" width="8" height="3" rx="1" fill="#BFDBFE" />
      </svg>
    ),
    chat: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="3" width="14" height="10" rx="1" fill="#065F46" />
        <rect x="3" y="4" width="12" height="8" rx="1" fill="#10B981" />
        <rect x="5" y="6" width="8" height="1" fill="#D1FAE5" />
        <rect x="5" y="8" width="6" height="1" fill="#D1FAE5" />
        <rect x="5" y="14" width="3" height="2" fill="#065F46" />
        <rect x="4" y="13" width="2" height="2" fill="#065F46" />
      </svg>
    ),
    users: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ imageRendering: 'pixelated' }}>
        <rect x="6" y="2" width="5" height="5" rx="1" fill="#FCD34D" />
        <rect x="5" y="7" width="7" height="5" rx="1" fill="#F59E0B" />
        <rect x="2" y="4" width="4" height="4" rx="1" fill="#FDE68A" />
        <rect x="1" y="8" width="5" height="4" rx="1" fill="#FCD34D" />
        <rect x="12" y="4" width="4" height="4" rx="1" fill="#FDE68A" />
        <rect x="12" y="8" width="5" height="4" rx="1" fill="#FCD34D" />
      </svg>
    ),
    coin: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ imageRendering: 'pixelated' }}>
        <ellipse cx="7" cy="7" rx="5" ry="5" fill="#B45309" />
        <ellipse cx="7" cy="6.5" rx="4" ry="4" fill="#F59E0B" />
        <text x="7" y="9" textAnchor="middle" fill="#7C3F00" fontSize="5" fontWeight="bold" fontFamily="monospace">$</text>
      </svg>
    ),
    pixel: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="2" width="4" height="4" fill="#6366F1" />
        <rect x="8" y="2" width="4" height="4" fill="#6366F1" />
        <rect x="2" y="8" width="4" height="4" fill="#6366F1" />
        <rect x="8" y="8" width="4" height="4" fill="#6366F1" />
        <rect x="5" y="5" width="4" height="4" fill="#A5B4FC" />
      </svg>
    ),
  };
  return <>{icons[type] ?? null}</>;
};

export default function BottomBar({
  onSendMessage,
  onToggleHistory,
  onToggleConvocation,
  onToggleChatLog,
  presentUsers = [],
}: BottomBarProps) {
  const [chatInput, setChatInput]   = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [inputFlash,  setInputFlash]  = useState(false);
  const [isFocused,   setIsFocused]   = useState(false);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setChatInput('');
    setInputFlash(true);
    setTimeout(() => setInputFlash(false), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit(e as unknown as React.FormEvent);
    }
  };

  const btnStyle = (active?: boolean): React.CSSProperties => ({
    background: active
      ? 'linear-gradient(180deg, #2A60A2 0%, #1A4A82 100%)'
      : 'linear-gradient(180deg, #383838 0%, #222 100%)',
    border: '2px solid #555',
    borderBottom: active ? '2px solid #7AB8FF' : '2px solid #111',
    borderRight:  active ? '2px solid #7AB8FF' : '2px solid #111',
    cursor: 'pointer',
    transition: 'background 0.1s',
  });

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">

      {/* Barra de presenca */}
      {presentUsers.length > 0 && (
        <div
          className="absolute bottom-[52px] left-2 flex items-center gap-1 px-2 py-1"
          style={{
            background: 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
            border: '2px solid #444',
            borderBottom: '2px solid #111',
            borderRight: '2px solid #111',
            borderRadius: '3px 3px 0 0',
          }}
        >
          <span className="text-[7px] text-[#F59E0B] font-pixel mr-1 tracking-widest">NA SALA:</span>
          {presentUsers.slice(0, 12).map(u => (
            <div
              key={u.id}
              className="w-5 h-5 flex items-center justify-center text-[7px] font-bold text-white"
              style={{
                backgroundColor: u.color,
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 1px 0 rgba(0,0,0,0.5)',
                imageRendering: 'pixelated',
              }}
              title={u.name}
            >
              {u.name[0]}
            </div>
          ))}
        </div>
      )}

      {/* Card de perfil */}
      {showProfile && (
        <div
          className="absolute bottom-[56px] left-2 p-3 w-52 z-50"
          style={{
            background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
            border: '2px solid #334155',
            borderBottom: '2px solid #1E293B',
            borderRight: '2px solid #1E293B',
            boxShadow: '3px 3px 0 #000',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 flex items-center justify-center text-white text-xs font-bold"
              style={{ background: '#4A90E2', border: '2px solid #7AB8FF', borderBottom: '2px solid #2A60A2', imageRendering: 'pixelated' }}
            >BL</div>
            <div>
              <div className="text-white text-[9px] font-bold">Bruno Lima</div>
              <div className="text-[#F59E0B] text-[8px]">Economista · Agronegócio</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #334155', paddingTop: 6 }}>
            <div className="text-[8px] text-slate-400">Cuiabá, MT · Tech & ERP</div>
            <div className="text-[8px] text-[#F59E0B] mt-0.5">Board Room Host ★</div>
          </div>
        </div>
      )}

      {/* HUD principal */}
      <div
        className="h-[52px] flex items-center px-2 gap-2"
        style={{
          background: 'linear-gradient(180deg, #2D2D2D 0%, #1A1A1A 100%)',
          borderTop: '2px solid #555',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Contadores */}
        <div className="flex items-center gap-1 mr-1">
          <div
            className="flex items-center gap-1 px-2 py-1"
            style={{
              background: 'linear-gradient(180deg, #3D2A00 0%, #1A1200 100%)',
              border: '1px solid #7C3F00',
              borderBottom: '2px solid #000',
              borderRight: '2px solid #000',
            }}
          >
            <PixelIcon type="coin" />
            <span className="text-[#F59E0B] text-[9px] font-bold">2,000</span>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1"
            style={{
              background: 'linear-gradient(180deg, #1A0A3D 0%, #0A0520 100%)',
              border: '1px solid #4338CA',
              borderBottom: '2px solid #000',
              borderRight: '2px solid #000',
            }}
          >
            <PixelIcon type="pixel" />
            <span className="text-[#A5B4FC] text-[9px] font-bold">SCOUT</span>
          </div>
        </div>

        {/* Botoes esquerda */}
        <div className="flex gap-1">
          <button
            onClick={() => setShowProfile(p => !p)}
            className="w-9 h-9 flex items-center justify-center"
            style={btnStyle(showProfile)}
            title="Meu Perfil"
            aria-label="Meu Perfil"
          >
            <PixelIcon type="profile" />
          </button>
          <button
            onClick={onToggleHistory}
            className="w-9 h-9 flex items-center justify-center"
            style={btnStyle()}
            title="Histórico de Conversas"
            aria-label="Histórico"
          >
            <PixelIcon type="history" />
          </button>
        </div>

        {/* Chat input */}
        <form onSubmit={handleChatSubmit} className="flex-1 flex items-center gap-1 max-w-2xl">
          <div
            className="flex-1 h-8 flex items-center px-2"
            style={{
              background: '#fff',
              border: '2px solid #111',
              borderBottom: isFocused ? '2px solid #4A90E2' : '2px solid #555',
              borderRight:  isFocused ? '2px solid #4A90E2' : '2px solid #555',
              outline: inputFlash ? '2px solid #4A90E2' : 'none',
              transition: 'border-color 0.15s, outline 0.15s',
            }}
          >
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full h-full outline-none text-black"
              style={{ fontSize: 11, fontFamily: 'monospace' }}
              placeholder="Pergunte ao Board Room..."
              maxLength={200}
            />
          </div>
          <button
            type="submit"
            className="h-8 px-3 font-bold text-white"
            style={{
              fontSize: 10,
              fontFamily: 'monospace',
              background: 'linear-gradient(180deg, #4A90E2 0%, #2A60B2 100%)',
              border: '2px solid #7AB8FF',
              borderBottom: '2px solid #1A4080',
              borderRight: '2px solid #1A4080',
              cursor: 'pointer',
            }}
          >
            FALAR
          </button>
        </form>

        {/* Botoes direita */}
        <div className="flex gap-1 ml-auto">
          <button
            onClick={onToggleChatLog}
            className="w-9 h-9 flex items-center justify-center"
            style={btnStyle()}
            title="Board Room Chat"
            aria-label="Chat"
          >
            <PixelIcon type="chat" />
          </button>
          <button
            onClick={onToggleConvocation}
            className="w-9 h-9 flex items-center justify-center"
            style={btnStyle()}
            title="Convocar Especialistas"
            aria-label="Convocar"
          >
            <PixelIcon type="users" />
          </button>
        </div>
      </div>
    </div>
  );
}
