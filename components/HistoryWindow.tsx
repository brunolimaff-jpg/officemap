import React, { useState } from 'react';
import DraggableWindow from './DraggableWindow';
import { ChatSession } from '@/hooks/useChatHistory';

interface HistoryWindowProps {
  onClose: () => void;
  sessions: ChatSession[];
  onLoadSession: (id: string) => void;
  onNewSession: () => void;
}

export default function HistoryWindow({ onClose, sessions, onLoadSession, onNewSession }: HistoryWindowProps) {
  const [confirmNew, setConfirmNew] = useState(false);

  const handleNewSession = () => {
    if (!confirmNew) { setConfirmNew(true); return; }
    onNewSession();
    setConfirmNew(false);
  };

  return (
    <DraggableWindow
      title="📜 Histórico de Conversas"
      onClose={onClose}
      defaultX={80}
      defaultY={80}
      width={320}
      height={440}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0d1117',
          fontFamily: 'monospace',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '6px 10px',
            background: '#161b22',
            borderBottom: '1px solid #30363d',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#8b949e', fontSize: 10 }}>
            {sessions.length} sess{sessions.length === 1 ? 'ão' : 'ões'} salvas
          </span>
          <button
            onClick={handleNewSession}
            style={{
              background: confirmNew
                ? 'linear-gradient(180deg, #8B0000 0%, #5A0000 100%)'
                : 'linear-gradient(180deg, #238636 0%, #1a6429 100%)',
              border: confirmNew ? '1px solid #C00' : '1px solid #2ea043',
              borderBottom: '2px solid #000',
              borderRight: '2px solid #000',
              color: '#fff',
              fontSize: 10,
              padding: '3px 10px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            {confirmNew ? 'Confirmar?' : '+ Nova Sessão'}
          </button>
        </div>

        {/* Lista */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 6px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#30363d #0d1117',
          }}
        >
          {sessions.length === 0 ? (
            <div
              style={{
                color: '#484f58',
                textAlign: 'center',
                padding: '24px 0',
                fontSize: 11,
                fontStyle: 'italic',
              }}
            >
              Nenhuma sessão salva ainda.
            </div>
          ) : (
            sessions
              .slice()
              .sort((a, b) => b.date - a.date)
              .map(session => (
                <div
                  key={session.id}
                  onClick={() => onLoadSession(session.id)}
                  style={{
                    padding: '8px 10px',
                    marginBottom: 3,
                    cursor: 'pointer',
                    background: '#161b22',
                    border: '1px solid #21262d',
                    borderLeft: '3px solid #1f6feb',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1c2d4a')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#161b22')}
                >
                  <div style={{ color: '#e6edf3', fontSize: 11, fontWeight: 'bold', marginBottom: 2 }}>
                    {session.title || 'Sessão sem título'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#484f58', fontSize: 9 }}>
                      {new Date(session.date).toLocaleString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: '2-digit',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <span
                      style={{
                        color: '#3fb950',
                        fontSize: 9,
                        background: '#0d1117',
                        border: '1px solid #21262d',
                        padding: '1px 5px',
                      }}
                    >
                      {session.messages.length} msg
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Footer */}
        {confirmNew && (
          <div
            style={{
              padding: '6px 10px',
              background: '#1c0a0a',
              borderTop: '1px solid #500',
              fontSize: 10,
              color: '#FCA5A5',
              fontFamily: 'monospace',
              textAlign: 'center',
            }}
          >
            Isso apaga o chat atual. Clique de novo para confirmar.
          </div>
        )}
      </div>
    </DraggableWindow>
  );
}
