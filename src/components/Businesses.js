'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Building2, TrendingUp } from 'lucide-react';

const defaultBusinesses = [
  {
    name: 'Bakeria',
    description: 'A bakery business with modern POS system and digital inventory management. Delivering fresh goods daily.',
    logo_url: null,
    website_url: '#',
    category: 'Food & Beverage',
    founded_year: '2023',
    status: 'Active',
  },
  {
    name: 'Tech Solutions',
    description: 'Software development agency helping businesses digitize their operations through custom web and mobile apps.',
    logo_url: null,
    website_url: '#',
    category: 'Technology',
    founded_year: '2024',
    status: 'Active',
  },
  {
    name: 'Digital Store',
    description: 'E-commerce platform selling digital products, templates, and design resources for developers and creators.',
    logo_url: null,
    website_url: '#',
    category: 'E-Commerce',
    founded_year: '2024',
    status: 'Growing',
  },
];

export default function Businesses({ businesses }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const data = businesses && businesses.length > 0 ? businesses : defaultBusinesses;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'badge-green';
      case 'growing': return 'badge-yellow';
      default: return 'badge-gray';
    }
  };

  return (
    <section id="business" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">

          <h2 className="section-title">
            My <span className="highlight">Businesses</span>
          </h2>
          <p className="section-desc">
            Beyond coding, I build and manage businesses that create real-world impact
          </p>
        </div>

        <div className={`biz-grid ${isVisible ? 'biz-visible' : ''}`}>
          {data.map((biz, i) => (
            <div
              key={i}
              className="biz-card glass-card"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="biz-header">
                <div className="biz-logo" style={{ overflow: 'hidden' }}>
                  {biz.logo_url ? (
                    <img src={biz.logo_url} alt={biz.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Building2 size={28} />
                  )}
                </div>
                <div className="biz-meta">
                  <span className={`badge ${getStatusColor(biz.status)}`}>
                    {biz.status}
                  </span>
                </div>
              </div>

              <h3 className="biz-name">{biz.name}</h3>
              <p className="biz-desc">{biz.description}</p>

              <div className="biz-footer">
                <div className="biz-info">
                  <span className="biz-category">
                    <TrendingUp size={14} />
                    {biz.category}
                  </span>
                  <span className="biz-year">Est. {biz.founded_year}</span>
                </div>

                {biz.website_url && biz.website_url !== '#' && (
                  <a href={biz.website_url} target="_blank" rel="noopener noreferrer" className="biz-link">
                    <ExternalLink size={16} />
                    Visit
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .biz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }
        .biz-visible .biz-card {
          animation: fadeInUp 0.6s ease forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .biz-card {
          padding: 32px;
          opacity: 0;
          position: relative;
          overflow: hidden;
        }
        .biz-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ffd700, transparent);
        }
        .biz-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .biz-logo {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,215,0,0.08);
          border: 1px solid rgba(255,215,0,0.15);
          border-radius: 12px;
          color: #ffd700;
        }
        .biz-name {
          font-size: 1.3rem;
          color: #f5f5f5;
          margin-bottom: 12px;
        }
        .biz-desc {
          color: #888;
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .biz-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .biz-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .biz-category {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #ffd700;
        }
        .biz-year {
          font-size: 0.75rem;
          color: #666;
          font-family: 'JetBrains Mono', monospace;
        }
        .biz-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(255,215,0,0.08);
          border: 1px solid rgba(255,215,0,0.15);
          border-radius: 8px;
          color: #ffd700;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .biz-link:hover {
          background: rgba(255,215,0,0.15);
          border-color: rgba(255,215,0,0.3);
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .biz-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
