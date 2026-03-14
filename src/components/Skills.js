'use client';

import { useEffect, useRef, useState } from 'react';

const defaultSkills = [
  { name: 'JavaScript', category: 'Frontend', level: 90 },
  { name: 'React / Next.js', category: 'Frontend', level: 85 },
  { name: 'HTML & CSS', category: 'Frontend', level: 95 },
  { name: 'Node.js', category: 'Backend', level: 80 },
  { name: 'Python', category: 'Backend', level: 75 },
  { name: 'PostgreSQL', category: 'Backend', level: 70 },
  { name: 'AI / Machine Learning', category: 'AI & Tools', level: 65 },
  { name: 'Git & DevOps', category: 'AI & Tools', level: 75 },
  { name: 'Figma', category: 'AI & Tools', level: 70 },
];

export default function Skills({ skills }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const sectionRef = useRef(null);

  const data = skills && skills.length > 0 ? skills : defaultSkills;

  const categories = ['All', ...new Set(data.map(s => s.category))];
  const filtered = activeCategory === 'All' ? data : data.filter(s => s.category === activeCategory);

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
          <span className="section-label">// Skills</span>
          <h2 className="section-title">
            My <span className="highlight">Tech Stack</span>
          </h2>
          <p className="section-desc">Technologies and tools I use to bring ideas to life</p>
        </div>

        <div className="skill-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'filter-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={`skills-grid ${isVisible ? 'skills-visible' : ''}`}>
          {filtered.map((skill, i) => (
            <div
              key={skill.name}
              className="skill-card glass-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div
                  className="skill-bar-fill"
                  style={{ width: isVisible ? `${skill.level}%` : '0%' }}
                />
              </div>
              <span className="skill-category">{skill.category}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .skill-filters {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 8px 20px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #888;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .filter-btn:hover {
          border-color: rgba(255,215,0,0.3);
          color: #ffd700;
        }
        .filter-active {
          background: rgba(255,215,0,0.1);
          border-color: #ffd700;
          color: #ffd700;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }
        .skills-visible .skill-card {
          animation: fadeInUp 0.5s ease forwards;
        }
        .skill-card {
          padding: 24px;
          opacity: 0;
        }
        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .skill-name {
          font-weight: 600;
          font-size: 1rem;
          color: #f5f5f5;
        }
        .skill-level {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: #ffd700;
        }
        .skill-bar {
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffd700, #ffb800);
          border-radius: 3px;
          transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 10px rgba(255,215,0,0.3);
        }
        .skill-category {
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
