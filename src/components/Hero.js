'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Twitter, Instagram, Youtube, Facebook, Link as LinkIcon, Download } from 'lucide-react';

export default function Hero({ profile, socialLinks }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const name = profile?.name || 'Ahmad Azhar';
  const title = profile?.title || 'Full-Stack Developer & Entrepreneur';
  const links = socialLinks && socialLinks.length > 0 ? socialLinks : [
    { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' }
  ];

  const getIcon = (iconStr, size=20) => {
    switch (iconStr?.toLowerCase()) {
      case 'github': return <Github size={size} />;
      case 'linkedin': return <Linkedin size={size} />;
      case 'twitter': return <Twitter size={size} />;
      case 'instagram': return <Instagram size={size} />;
      case 'youtube': return <Youtube size={size} />;
      case 'facebook': return <Facebook size={size} />;
      case 'email':
      case 'mail': return <Mail size={size} />;
      default: return <LinkIcon size={size} />;
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-bg">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      <div className={`hero-content ${mounted ? 'hero-visible' : ''}`}>


        <h1 className="hero-name">
          Hi, I&apos;m <span className="highlight">{name}</span>
        </h1>

        <div className="hero-title-wrapper">
          <p className="hero-title">{title}</p>
        </div>

        <p className="hero-desc">
          {profile?.bio || 'Crafting digital experiences, building businesses, and turning ideas into reality through code and entrepreneurship.'}
        </p>

        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            View My Work
            <ArrowDown size={18} />
          </a>
          {profile?.resume_url ? (
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Resume <Download size={18} />
            </a>
          ) : (
            <a href="#contact" className="btn btn-outline">
              Get In Touch
            </a>
          )}
        </div>

        <div className="hero-socials">
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hero-social-link" title={link.platform}>
              {getIcon(link.icon)}
            </a>
          ))}
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-line" />
      </div>

      <style jsx>{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 120px 24px 80px;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }
        .hero-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,215,0,0.3), transparent 70%);
          top: -10%; right: -10%;
          animation: float 8s ease-in-out infinite;
        }
        .hero-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,184,0,0.2), transparent 70%);
          bottom: -10%; left: -5%;
          animation: float 10s ease-in-out infinite reverse;
        }
        .hero-orb-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(255,215,0,0.15), transparent 70%);
          top: 40%; left: 30%;
          animation: float 6s ease-in-out infinite 2s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        .hero-content {
          text-align: center;
          max-width: 800px;
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(255,215,0,0.08);
          border: 1px solid rgba(255,215,0,0.15);
          border-radius: 50px;
          font-size: 0.85rem;
          color: #ffd700;
          margin-bottom: 32px;
          font-weight: 500;
        }
        .hero-dot {
          width: 8px; height: 8px;
          background: #00c864;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
        .hero-name {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }
        .highlight {
          color: #ffd700;
          position: relative;
        }
        .hero-title-wrapper {
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: #aaa;
          font-weight: 400;
        }
        .hero-desc {
          color: #888;
          font-size: 1.05rem;
          max-width: 550px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .hero-socials {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        .hero-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          color: #aaa;
          transition: all 0.3s ease;
        }
        .hero-social-link:hover {
          color: #ffd700;
          border-color: rgba(255,215,0,0.3);
          background: rgba(255,215,0,0.05);
          transform: translateY(-3px);
        }
        .hero-scroll-indicator {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
        }
        .scroll-line {
          width: 2px;
          height: 40px;
          background: linear-gradient(to bottom, #ffd700, transparent);
          animation: scrollDown 2s ease-in-out infinite;
        }
        @keyframes scrollDown {
          0% { opacity: 0; transform: scaleY(0); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
          100% { opacity: 0; transform: scaleY(0); transform-origin: bottom; }
        }
        @media (max-width: 768px) {
          .hero { padding: 100px 16px 60px; }
          .hero-actions { flex-direction: column; align-items: center; }
        }
      `}</style>
    </section>
  );
}
