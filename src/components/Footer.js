'use client';
import { Github, Linkedin, Twitter, Heart, Instagram, Youtube, Facebook, Link as LinkIcon } from 'lucide-react';

export default function Footer({ socialLinks }) {
  const links = socialLinks && socialLinks.length > 0 ? socialLinks : [
    { platform: 'GitHub', url: '#', icon: 'github' },
    { platform: 'LinkedIn', url: '#', icon: 'linkedin' },
    { platform: 'Twitter', url: '#', icon: 'twitter' },
  ];

  const getIcon = (iconStr) => {
    switch (iconStr?.toLowerCase()) {
      case 'github': return <Github size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'youtube': return <Youtube size={18} />;
      case 'facebook': return <Facebook size={18} />;
      default: return <LinkIcon size={18} />;
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <a href="#home" className="footer-logo">

          </a>
          <div className="footer-socials">
            {links.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="footer-social">{getIcon(link.icon)}</a>
            ))}
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} ZHARCOMPANY
          </p>
        </div>
      </div>
      <style jsx>{`
        .footer{padding:40px 0;border-top:1px solid rgba(255,255,255,.05)}
        .footer-content{text-align:center}
        .footer-logo{font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:700;color:#f5f5f5;text-decoration:none;display:inline-block;margin-bottom:16px}
        .footer-socials{display:flex;justify-content:center;gap:12px;margin-bottom:16px}
        .footer-social{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,.08);color:#888;transition:all .3s ease;text-decoration:none}
        .footer-social:hover{color:#ffd700;border-color:rgba(255,215,0,.3);background:rgba(255,215,0,.05);transform:translateY(-2px)}
        .footer-copy{color:#555;font-size:.85rem}
      `}</style>
    </footer>
  );
}
