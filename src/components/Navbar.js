'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
        <a href="#home" className="nav-logo">
          <span className="logo-bracket">&lt;</span>
          AZ
          <span className="logo-bracket">/&gt;</span>
        </a>

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

        <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
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
        .nav-toggle {
          display: none;
          background: none;
          border: none;
          color: #ffd700;
          cursor: pointer;
          padding: 8px;
        }
        @media (max-width: 768px) {
          .nav-toggle { display: block; }
          .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 16px;
            border-bottom: 1px solid rgba(255, 215, 0, 0.1);
          }
          .nav-links-open { display: flex; }
          .nav-link { width: 100%; padding: 12px 16px; }
        }
      `}</style>
    </nav>
  );
}
