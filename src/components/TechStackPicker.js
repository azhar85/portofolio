'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { resolveTechIconFromValue, techIconLibrary } from '@/lib/skill-icons';

export default function TechStackPicker({ value = [], onChange, placeholder = 'Select tech stack' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const filteredOptions = techIconLibrary.filter((item) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return true;

    return [item.label, item.value, ...(item.aliases || [])].some((entry) =>
      entry.toLowerCase().includes(keyword)
    );
  });

  const toggleTech = (techValue) => {
    if (value.includes(techValue)) {
      onChange(value.filter((item) => item !== techValue));
      return;
    }

    onChange([...value, techValue]);
  };

  return (
    <div className="stack-picker" ref={containerRef}>
      <div className="stack-selected">
        <div className="stack-chip-list">
          {value.length > 0 ? (
            value.map((item) => {
              const iconMeta = resolveTechIconFromValue(item);
              const Icon = iconMeta?.icon;

              return (
                <span key={item} className="stack-chip">
                  <span className="stack-chip-main">
                    {Icon && (
                      <span className="stack-chip-icon" style={{ color: iconMeta?.color || '#ffd700' }}>
                        <Icon size={14} />
                      </span>
                    )}
                    <span>{iconMeta?.label || item}</span>
                  </span>
                  <button type="button" onClick={() => toggleTech(item)} className="stack-chip-remove" aria-label={`Remove ${iconMeta?.label || item}`}>
                    <X size={12} />
                  </button>
                </span>
              );
            })
          ) : (
            <span className="stack-placeholder">{placeholder}</span>
          )}
        </div>
        <button type="button" className="stack-toggle" onClick={() => setOpen((current) => !current)}>
          Browse Library
          <ChevronDown size={16} className={open ? 'stack-toggle-open' : ''} />
        </button>
      </div>

      {open && (
        <div className="stack-panel">
          <div className="stack-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tech: nextjs, firebase, llm, yolo..."
            />
          </div>
          <div className="stack-options">
            {filteredOptions.map((item) => {
              const Icon = item.icon;
              const active = value.includes(item.value);

              return (
                <button
                  key={item.value}
                  type="button"
                  className={`stack-option ${active ? 'stack-option-active' : ''}`}
                  onClick={() => toggleTech(item.value)}
                >
                  <span className="stack-option-icon" style={{ color: item.color }}>
                    <Icon size={20} />
                  </span>
                  <span className="stack-option-text">
                    <strong>{item.label}</strong>
                    <small>{item.category}</small>
                  </span>
                  {active && <Check size={16} className="stack-option-check" />}
                </button>
              );
            })}
            {filteredOptions.length === 0 && <p className="stack-empty">No matching tech found.</p>}
          </div>
        </div>
      )}

      <style jsx>{`
        .stack-picker {
          position: relative;
        }
        .stack-selected {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px;
        }
        .stack-chip-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          min-height: 20px;
        }
        .stack-placeholder {
          color: #666;
          font-size: .86rem;
        }
        .stack-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px 6px 10px;
          border-radius: 999px;
          background: rgba(255,215,0,.08);
          border: 1px solid rgba(255,215,0,.18);
          color: #f5f5f5;
          font-size: .78rem;
        }
        .stack-chip-main {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .stack-chip-icon {
          display: inline-flex;
          align-items: center;
        }
        .stack-chip-remove {
          width: 18px;
          height: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(0,0,0,.28);
          color: #aaa;
          border: none;
          padding: 0;
        }
        .stack-chip-remove:hover {
          color: #fff;
          background: rgba(255,255,255,.15);
        }
        .stack-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          align-self: flex-start;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          color: #f5f5f5;
          font-size: .84rem;
        }
        .stack-toggle :global(svg) {
          transition: transform .2s ease;
        }
        .stack-toggle-open {
          transform: rotate(180deg);
        }
        .stack-panel {
          margin-top: 12px;
          padding: 14px;
          border-radius: 14px;
          background: rgba(10,10,10,.96);
          border: 1px solid rgba(255,255,255,.08);
          box-shadow: 0 20px 40px rgba(0,0,0,.35);
        }
        .stack-search {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          margin-bottom: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
        }
        .stack-search :global(svg) {
          color: #666;
        }
        .stack-search input {
          width: 100%;
          padding: 12px 0;
          border: none;
          background: transparent;
          color: #f5f5f5;
          outline: none;
          font-size: .88rem;
        }
        .stack-options {
          max-height: 280px;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .stack-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,255,255,.02);
          border: 1px solid rgba(255,255,255,.06);
          color: #d4d4d4;
          text-align: left;
          transition: all .2s ease;
        }
        .stack-option:hover {
          border-color: rgba(255,215,0,.24);
          background: rgba(255,215,0,.05);
        }
        .stack-option-active {
          border-color: rgba(255,215,0,.4);
          background: rgba(255,215,0,.08);
        }
        .stack-option-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255,255,255,.03);
          flex-shrink: 0;
        }
        .stack-option-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          flex: 1;
        }
        .stack-option-text strong {
          font-size: .84rem;
          color: #f5f5f5;
        }
        .stack-option-text small {
          color: #777;
          font-size: .72rem;
        }
        .stack-option-check {
          color: #ffd700;
          flex-shrink: 0;
        }
        .stack-empty {
          grid-column: 1 / -1;
          margin: 0;
          padding: 24px 12px;
          text-align: center;
          color: #777;
          font-size: .84rem;
        }
        @media (max-width: 640px) {
          .stack-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
