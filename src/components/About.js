'use client';

import { useEffect, useRef, useState } from 'react';
import { User, Calendar, Briefcase, MapPin } from 'lucide-react';

export default function About({ profile, experiences }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'Years Experience', value: '3+' },
    { label: 'Projects Completed', value: '20+' },
    { label: 'Business Ventures', value: '3+' },
    { label: 'Technologies', value: '15+' },
  ];

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">

          <h2 className="section-title">
            Know Who <span className="highlight">I Am</span>
          </h2>
        </div>

        <div className={`about-grid ${isVisible ? 'about-visible' : ''}`}>
          <div className="about-left">
            <div className="about-avatar glass-card">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
              ) : (
                <div className="avatar-placeholder">
                  <User size={64} strokeWidth={1} />
                </div>
              )}
            </div>
          </div>

          <div className="about-right">
            <p className="about-text">
              {profile?.bio || "I'm a passionate developer and entrepreneur based in Indonesia. I love building digital products that solve real-world problems and creating businesses that make an impact. With expertise in full-stack development and AI, I bridge the gap between technology and business."}
            </p>

            <div className="about-info-grid">
              <div className="about-info-item">
                <MapPin size={16} />
                <span>Indonesia</span>
              </div>
              <div className="about-info-item">
                <Briefcase size={16} />
                <span>Developer & Entrepreneur</span>
              </div>
              <div className="about-info-item">
                <Calendar size={16} />
                <span>Available for Freelance</span>
              </div>
            </div>

            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-item glass-card">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {experiences && experiences.length > 0 && (
          <div className={`timeline ${isVisible ? 'about-visible' : ''}`}>
            <h3 className="timeline-title">Experience</h3>
            <div className="timeline-list">
              {experiences.map((exp, i) => (
                <div key={i} className="timeline-item glass-card">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-date">
                      {exp.start_date} — {exp.end_date || 'Present'}
                    </span>
                    <h4 className="timeline-role">{exp.role}</h4>
                    <p className="timeline-company">{exp.company}</p>
                    {exp.description && (
                      <p className="timeline-desc">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .about-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 60px;
          align-items: start;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .about-avatar {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .about-avatar::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #ffd700, transparent, #ffd700);
          border-radius: 16px;
          z-index: -1;
          opacity: 0.5;
        }
        .avatar-placeholder {
          color: #ffd700;
          opacity: 0.3;
        }
        .about-text {
          color: #aaa;
          font-size: 1.05rem;
          line-height: 1.8;
          margin-bottom: 24px;
        }
        .about-info-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 32px;
        }
        .about-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          font-size: 0.9rem;
        }
        .about-info-item :global(svg) {
          color: #ffd700;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .stat-item {
          padding: 20px;
          text-align: center;
        }
        .stat-item:hover {
          transform: translateY(-4px);
        }
        .stat-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #ffd700;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 0.8rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .timeline {
          margin-top: 80px;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
        }
        .timeline-title {
          font-size: 1.5rem;
          color: #ffd700;
          margin-bottom: 32px;
          text-align: center;
        }
        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 700px;
          margin: 0 auto;
          position: relative;
        }
        .timeline-list::before {
          content: '';
          position: absolute;
          left: 20px;
          top: 20px;
          bottom: 20px;
          width: 2px;
          background: linear-gradient(to bottom, #ffd700, transparent);
        }
        .timeline-item {
          padding: 24px 24px 24px 52px;
          position: relative;
        }
        .timeline-dot {
          position: absolute;
          left: 14px;
          top: 28px;
          width: 14px;
          height: 14px;
          background: #ffd700;
          border-radius: 50%;
          border: 3px solid #0a0a0a;
        }
        .timeline-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: #ffd700;
        }
        .timeline-role {
          font-size: 1.1rem;
          color: #f5f5f5;
          margin: 4px 0;
        }
        .timeline-company {
          color: #888;
          font-size: 0.95rem;
        }
        .timeline-desc {
          color: #666;
          font-size: 0.9rem;
          margin-top: 8px;
          line-height: 1.6;
        }
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .about-avatar {
            max-width: 200px;
            margin: 0 auto;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
