'use client';

import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Business', href: '#business' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navLinks.map(l => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">


        <div className={`nav-links ${mobileOpen ? 'nav-links-open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${activeSection === link.href.replace('#', '') ? 'nav-link-active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button className={`nav-toggle ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span className="hamburger-line top-line"></span>
          <span className="hamburger-line middle-line-1"></span>
          <span className="hamburger-line middle-line-2"></span>
          <span className="hamburger-line bottom-line"></span>
        </button>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 20px 0;
          transition: all 0.3s ease;
        }
        .navbar-scrolled {
          background: rgba(10, 10, 10, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
          padding: 12px 0;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #f5f5f5;
          text-decoration: none;
        }
        .logo-bracket {
          color: #ffd700;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          padding: 8px 16px;
          color: #aaa;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
        }
        .nav-link:hover {
          color: #ffd700;
          background: rgba(255, 215, 0, 0.05);
        }
        .nav-link-active {
          color: #ffd700;
        }
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: #ffd700;
          border-radius: 2px;
        }
        /* Modern Hamburger Menu */
        .nav-toggle {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
          position: relative;
        }
        
        .hamburger-line {
          display: block;
          position: absolute;
          height: 2px;
          width: 24px;
          background: #ffd700;
          border-radius: 2px;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .top-line { transform: translateY(-8px); width: 14px; right: 10px; }
        .middle-line-1 { transform: translateY(0); }
        .middle-line-2 { transform: translateY(0); opacity: 0; }
        .bottom-line { transform: translateY(8px); width: 18px; right: 10px; }
        
        .nav-toggle:hover .top-line, .nav-toggle:hover .bottom-line { width: 24px; right: 10px; }
        
        .nav-toggle.open .top-line {
          transform: translateY(0) rotate(45deg);
          width: 24px;
        }
        
        .nav-toggle.open .middle-line-1 {
          opacity: 0;
          transform: rotate(45deg);
        }
        
        .nav-toggle.open .middle-line-2 {
          opacity: 1;
          transform: rotate(-45deg);
        }
        
        .nav-toggle.open .bottom-line {
          transform: translateY(0) rotate(-45deg);
          width: 24px;
          opacity: 0;
        }
        @media (max-width: 768px) {
          .nav-toggle { display: flex; }
          .nav-links {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 0;
            border-bottom: 1px solid rgba(255, 215, 0, 0.1);
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .nav-links-open { 
            max-height: 400px;
            padding: 16px;
            opacity: 1;
            visibility: visible;
          }
          .nav-link { 
            width: 100%; 
            padding: 16px;
            text-align: center;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease, color 0.3s ease, background 0.3s ease;
          }
          .nav-links-open .nav-link {
            opacity: 1;
            transform: translateY(0);
          }
          .nav-links-open .nav-link:nth-child(1) { transition-delay: 0.1s; }
          .nav-links-open .nav-link:nth-child(2) { transition-delay: 0.15s; }
          .nav-links-open .nav-link:nth-child(3) { transition-delay: 0.2s; }
          .nav-links-open .nav-link:nth-child(4) { transition-delay: 0.25s; }
          .nav-links-open .nav-link:nth-child(5) { transition-delay: 0.3s; }
          .nav-links-open .nav-link:nth-child(6) { transition-delay: 0.35s; }
          .nav-link-active::after { display: none; }
        }
      `}</style>
    </nav>
  );
}
