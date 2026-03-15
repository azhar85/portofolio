'use client';

import { useEffect, useRef, useState } from 'react';
import { Code2 } from 'lucide-react';
import { resolveSkillIconFromSkill } from '@/lib/skill-icons';

const defaultSkills = [
  { name: 'JavaScript', category: 'Frontend', icon: 'javascript' },
  { name: 'Next.js', category: 'Frontend', icon: 'nextjs' },
  { name: 'React', category: 'Frontend', icon: 'react' },
  { name: 'Tailwind CSS', category: 'Frontend', icon: 'tailwindcss' },
  { name: 'Laravel', category: 'Backend', icon: 'laravel' },
  { name: 'Node.js', category: 'Backend', icon: 'nodejs' },
  { name: 'MySQL', category: 'Database', icon: 'mysql' },
  { name: 'Firebase', category: 'Database', icon: 'firebase' },
  { name: 'Supabase', category: 'Database', icon: 'supabase' },
  { name: 'GitHub', category: 'Tools', icon: 'github' },
  { name: 'Docker', category: 'DevOps', icon: 'docker' },
  { name: 'Figma', category: 'Tools', icon: 'figma' },
];

export default function Skills({ skills }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const data = skills && skills.length > 0 ? skills : defaultSkills;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">

          <h2 className="section-title">
            My <span className="highlight">Tech Stack</span>
          </h2>
          <p className="section-desc">Technologies and tools I use to bring ideas to life</p>
        </div>

        <div className={`skills-grid ${isVisible ? 'skills-visible' : ''}`}>
          {data.map((skill, i) => (
            <div
              key={skill.name}
              className="skill-slot"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {(() => {
                const iconMeta = resolveSkillIconFromSkill(skill);
                const Icon = iconMeta?.icon || Code2;

                return (
                  <div
                    className="skill-card glass-card"
                    title={skill.name}
                    aria-label={skill.name}
                  >
                    <div className="skill-tooltip">{skill.name}</div>
                    <div className="skill-logo" style={{ color: iconMeta?.color || '#ffd700' }}>
                      <Icon />
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 18px;
        }
        .skills-visible .skill-slot {
          animation: fadeInUp 0.5s ease forwards;
        }
        .skill-slot {
          opacity: 0;
        }
        .skill-card {
          position: relative;
          min-height: 120px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .skill-card:hover {
          transform: translateY(-6px) scale(1.03);
        }
        .skill-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .skill-card:hover .skill-logo {
          transform: scale(1.08);
        }
        .skill-tooltip {
          position: absolute;
          left: 50%;
          bottom: 12px;
          transform: translateX(-50%) translateY(8px);
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(10, 10, 10, 0.92);
          border: 1px solid rgba(255, 215, 0, 0.16);
          color: #f5f5f5;
          font-size: 0.72rem;
          line-height: 1;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .skill-card:hover .skill-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }
          .skill-card {
            min-height: 104px;
            padding: 16px;
          }
          .skill-logo {
            font-size: 2.4rem;
          }
        }
      `}</style>
    </section>
  );
}
