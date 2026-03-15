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
  const [activeCard, setActiveCard] = useState(null);
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

  const toggleCard = (key) => {
    setActiveCard((current) => (current === key ? null : key));
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
            <div key={i} className="biz-slot" style={{ animationDelay: `${i * 0.15}s` }}>
              <div
                className={`biz-card glass-card ${activeCard === `biz-${i}` ? 'biz-card-active' : ''}`}
                onClick={() => toggleCard(`biz-${i}`)}
              >
                <div className="biz-header">
                  <div className="biz-logo" style={{ overflow: 'hidden' }}>
                    {biz.logo_url ? (
                      <img src={biz.logo_url} alt={biz.name} className="biz-logo-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

                <div className="biz-body">
                  <h3 className="biz-name">{biz.name}</h3>
                  <p className="biz-desc">{biz.description}</p>
                </div>

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
        .biz-slot {
          opacity: 0;
          position: relative;
          display: flex;
          padding: 10px 0 16px;
        }
        .biz-visible .biz-slot {
          animation: fadeInUp 0.6s ease forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .biz-card {
          width: 100%;
          min-height: 100%;
          padding: 28px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.28s ease, border-color 0.28s ease;
          z-index: 1;
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
        .biz-card:hover {
          transform: translateY(-6px) scale(1.015);
        }
        .biz-card-active {
          transform: translateY(-8px) scale(1.025);
          box-shadow: 0 20px 36px rgba(0, 0, 0, 0.32);
          border-color: rgba(255,215,0,0.28);
          z-index: 3;
        }
        .biz-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          gap: 16px;
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
          flex-shrink: 0;
        }
        .biz-logo-image {
          transition: transform 0.35s ease;
        }
        .biz-card:hover .biz-logo-image,
        .biz-card-active .biz-logo-image {
          transform: scale(1.04);
        }
        .biz-meta {
          margin-left: auto;
        }
        .biz-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .biz-name {
          font-size: 1.3rem;
          color: #f5f5f5;
          margin-bottom: 12px;
          line-height: 1.25;
        }
        .biz-desc {
          color: #888;
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 24px;
          flex: 1;
        }
        .biz-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
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
            gap: 18px;
          }
          .biz-slot {
            padding: 6px 0 12px;
          }
          .biz-card {
            padding: 24px 22px;
          }
          .biz-card:hover,
          .biz-card-active {
            transform: translateY(-4px) scale(1.01);
          }
        }
      `}</style>
    </section>
  );
}
