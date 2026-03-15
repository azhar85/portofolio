'use client';

import { Code2 } from 'lucide-react';
import { resolveTechIconFromValue } from '@/lib/skill-icons';

export default function TechBadge({ value, size = 'md' }) {
  const iconMeta = resolveTechIconFromValue(value);
  const Icon = iconMeta?.icon || Code2;
  const label = iconMeta?.label || value;

  return (
    <>
      <span className={`tech-badge tech-badge-${size}`} title={label}>
        <span className="tech-badge-icon" style={{ color: iconMeta?.color || '#ffd700' }}>
          <Icon />
        </span>
        <span className="tech-badge-label">{label}</span>
      </span>
      <style jsx>{`
        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          color: #d4d4d4;
          line-height: 1;
        }
        .tech-badge-md {
          font-size: 0.75rem;
        }
        .tech-badge-sm {
          padding: 5px 9px;
          font-size: 0.72rem;
        }
        .tech-badge-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .tech-badge-sm .tech-badge-icon {
          font-size: 0.88rem;
        }
        .tech-badge-label {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}
