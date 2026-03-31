import React, { useState, useMemo } from 'react';
import DraggableWindow from './DraggableWindow';
import { specialists } from '@/data/specialists';

interface ConvocationPanelProps {
  onClose: () => void;
  onSummon: (selectedIds: string[]) => void;
}

const ROLES = [
  { label: 'Todos', value: 'all' },
  { label: 'Lideranca', value: 'leadership' },
  { label: 'Eng', value: 'engineering' },
  { label: 'IA/Dados', value: 'ai' },
  { label: 'Produto', value: 'product' },
  { label: 'Negocio', value: 'business' },
];

const ROLE_MAP: Record<string, string[]> = {
  leadership:  ['satya', 'grove'],
  engineering: ['uncle_bob', 'dodds', 'rauch', 'whittaker'],
  ai:          ['karpathy', 'rogati', 'kozyrkov'],
  product:     ['cagan', 'osmani'],
  business:    ['dixon', 'rodrigues'],
};

export default function ConvocationPanel({ onClose, onSummon }: ConvocationPanelProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter]     = useState<string>('all');
  const [search, setSearch]     = useState<string>('');

  const filtered = useMemo(() => {
    return specialists.filter(s => {
      const matchFilter = filter === 'all' || (ROLE_MAP[filter]?.includes(s.id) ?? false);
      const matchSearch = search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [filter, search]);

  const toggleSelection = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(sId => sId !== id)
        : prev.length < 13 ? [...prev, id] : prev
    );
  };

  const selectAll = () => setSelected(filtered.map(s => s.id).slice(0, 13));
  const clearAll  = () => setSelected([]);

  const handleSummon = () => {
    if (selected.length > 0) {
      onSummon(selected);
      onClose();
    }
  };

  const btnBase: React.CSSProperties = {
    border: '2px solid #334155',
    borderBottom: '2px solid #0f172a',
    borderRight:  '2px solid #0f172a',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: 10,
    padding: '3px 8px',
    color: '#cbd5e1',
    transition: 'background 0.1s',
  };

  return (
    <DraggableWindow
      title="👥 Convocar Especialistas"
      onClose={onClose}
      defaultX={120}
      defaultY={60}
      width={400}
      height={580}
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
        {/* Header info */}
        <div style={{ padding: '6px 10px', background: '#161b22', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#8b949e', fontSize: 10 }}>Board Room — 13 Especialistas</span>
          <span style={{ color: '#3fb950', fontSize: 10 }}>{selected.length}/13 selecionados</span>
        </div>

        {/* Busca */}
        <div style={{ padding: '6px 8px', background: '#161b22', borderBottom: '1px solid #21262d' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar especialista..."
            style={{
              width: '100%',
              background: '#0d1117',
              border: '1px solid #30363d',
              color: '#e6edf3',
              fontSize: 11,
              padding: '4px 8px',
              fontFamily: 'monospace',
              outline: 'none',
            }}
          />
        </div>

        {/* Filtros por area */}
        <div style={{ display: 'flex', gap: 4, padding: '4px 8px', background: '#0d1117', borderBottom: '1px solid #21262d', flexWrap: 'wrap' }}>
          {ROLES.map(r => (
            <button
              key={r.value}
              onClick={() => setFilter(r.value)}
              style={{
                ...btnBase,
                background: filter === r.value ? '#1f6feb' : '#161b22',
                color: filter === r.value ? '#fff' : '#8b949e',
                borderColor: filter === r.value ? '#388bfd' : '#30363d',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Lista de especialistas */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 6px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#30363d #0d1117',
          }}
        >
          {filtered.map(specialist => {
            const isSelected = selected.includes(specialist.id);
            return (
              <div
                key={specialist.id}
                onClick={() => toggleSelection(specialist.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '7px 8px',
                  marginBottom: 2,
                  cursor: 'pointer',
                  background: isSelected ? '#1c2d4a' : '#161b22',
                  border: `1px solid ${isSelected ? specialist.color + '66' : '#21262d'}`,
                  borderLeft: `3px solid ${isSelected ? specialist.color : '#30363d'}`,
                  transition: 'background 0.1s, border 0.1s',
                }}
              >
                {/* Avatar dot */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    background: specialist.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 'bold',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.12)',
                    imageRendering: 'pixelated',
                    flexShrink: 0,
                  }}
                >
                  {specialist.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: specialist.color, fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {specialist.name}
                  </div>
                  <div style={{ color: '#8b949e', fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {specialist.role}
                  </div>
                  <div style={{ color: '#484f58', fontSize: 9, fontStyle: 'italic' }}>
                    {specialist.realPerson}
                  </div>
                </div>

                {/* Checkbox pixel */}
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: `2px solid ${isSelected ? specialist.color : '#30363d'}`,
                    background: isSelected ? specialist.color : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    imageRendering: 'pixelated',
                  }}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5 L4 7 L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ color: '#484f58', textAlign: 'center', padding: '20px 0', fontSize: 11, fontStyle: 'italic' }}>
              Nenhum especialista encontrado
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '8px 10px',
            background: '#161b22',
            borderTop: '1px solid #30363d',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={selectAll} style={{ ...btnBase, background: '#161b22' }}>Todos</button>
            <button onClick={clearAll}  style={{ ...btnBase, background: '#161b22' }}>Limpar</button>
          </div>
          <button
            onClick={handleSummon}
            disabled={selected.length === 0}
            style={{
              ...btnBase,
              background: selected.length > 0
                ? 'linear-gradient(180deg, #238636 0%, #1a6429 100%)'
                : '#161b22',
              color: selected.length > 0 ? '#fff' : '#484f58',
              borderColor: selected.length > 0 ? '#2ea043' : '#30363d',
              borderBottom: selected.length > 0 ? '2px solid #0d1117' : '2px solid #0f172a',
              padding: '5px 16px',
              fontSize: 11,
              fontWeight: 'bold',
              cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            📣 Convocar {selected.length > 0 ? `(${selected.length})` : ''}
          </button>
        </div>
      </div>
    </DraggableWindow>
  );
}
