'use client';
import { useRef, useState } from 'react';
import { Send, Mail, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const { error } = await supabase.from('messages').insert([{ ...formData, is_read: false }]);
      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch { setStatus('error'); }
    finally { setLoading(false); }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header">

          <h2 className="section-title">Let&apos;s <span className="highlight">Connect</span></h2>
          <p className="section-desc">Have a project in mind? Drop me a message!</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item glass-card"><Mail size={24} color="#ffd700" /><div><h4>Email</h4><p>hello@ahmadazhar.com</p></div></div>
            <div className="contact-item glass-card"><MapPin size={24} color="#ffd700" /><div><h4>Location</h4><p>Indonesia</p></div></div>
            <div className="contact-item glass-card"><Phone size={24} color="#ffd700" /><div><h4>Phone</h4><p>Available on request</p></div></div>
          </div>
          <form onSubmit={handleSubmit} className="contact-form glass-card">
            <div className="form-group"><label>Name</label><input type="text" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
            <div className="form-group"><label>Message</label><textarea placeholder="Your message..." rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required /></div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}<Send size={18} /></button>
            {status === 'success' && <div className="form-status form-success"><CheckCircle size={18} />Message sent!</div>}
            {status === 'error' && <div className="form-status form-error"><AlertCircle size={18} />Failed. Try again.</div>}
          </form>
        </div>
      </div>
      <style jsx>{`
        .contact-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:32px;max-width:900px;margin:0 auto}
        .contact-info{display:flex;flex-direction:column;gap:16px}
        .contact-item{display:flex;align-items:center;gap:16px;padding:24px}
        .contact-item h4{font-size:.85rem;color:#888;font-weight:500;margin-bottom:4px}
        .contact-item p{color:#f5f5f5;font-size:.95rem}
        .contact-form{padding:32px}
        .form-group{margin-bottom:20px}
        .form-group label{display:block;font-size:.85rem;color:#888;margin-bottom:8px;font-weight:500}
        .form-group input,.form-group textarea{width:100%;padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#f5f5f5;font-size:.95rem;transition:all .3s ease;outline:none;font-family:'Inter',sans-serif}
        .form-group input:focus,.form-group textarea:focus{border-color:rgba(255,215,0,.4);background:rgba(255,215,0,.03);box-shadow:0 0 0 3px rgba(255,215,0,.05)}
        .form-group input::placeholder,.form-group textarea::placeholder{color:#555}
        .form-group textarea{resize:vertical;min-height:120px}
        .form-status{display:flex;align-items:center;gap:8px;margin-top:16px;padding:12px 16px;border-radius:8px;font-size:.9rem;font-weight:500}
        .form-success{background:rgba(0,200,100,.1);color:#00c864;border:1px solid rgba(0,200,100,.2)}
        .form-error{background:rgba(255,60,60,.1);color:#ff4444;border:1px solid rgba(255,60,60,.2)}
        @media(max-width:768px){.contact-grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
