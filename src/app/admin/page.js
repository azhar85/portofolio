'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FolderKanban, Zap, MessageSquare, Building2, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0, unread: 0, businesses: 0 });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [p, s, m, b] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('skills').select('id', { count: 'exact' }),
        supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('businesses').select('id', { count: 'exact' }),
      ]);
      const unread = (m.data || []).filter(msg => !msg.is_read).length;
      setStats({ projects: p.count||0, skills: s.count||0, messages: (m.data||[]).length, unread, businesses: b.count||0 });
      setRecentMessages(m.data || []);
    };
    load();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: '#ffd700' },
    { label: 'Skills', value: stats.skills, icon: Zap, color: '#ffd700' },
    { label: 'Businesses', value: stats.businesses, icon: Building2, color: '#ffd700' },
    { label: 'Unread Messages', value: stats.unread, icon: MessageSquare, color: '#ff6b6b' },
  ];

  return (
    <div>
      <h1 style={{fontSize:'1.8rem',marginBottom:8}}>Dashboard</h1>
      <p style={{color:'#888',marginBottom:32}}>Welcome back! Here&apos;s an overview of your portfolio.</p>

      <div className="stat-grid">
        {statCards.map((s,i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card glass-card">
              <div className="stat-icon" style={{color:s.color}}><Icon size={24}/></div>
              <div><span className="stat-val">{s.value}</span><span className="stat-lbl">{s.label}</span></div>
            </div>
          );
        })}
      </div>

      <div className="recent-section glass-card">
        <h3 style={{fontSize:'1.1rem',marginBottom:16}}>Recent Messages</h3>
        {recentMessages.length === 0 ? <p style={{color:'#666'}}>No messages yet</p> :
          recentMessages.map((msg,i) => (
            <div key={i} className="msg-item">
              <div className="msg-header">
                <span className="msg-name">{msg.name}</span>
                {!msg.is_read && <span className="msg-badge">New</span>}
              </div>
              <p className="msg-email">{msg.email}</p>
              <p className="msg-text">{msg.message?.substring(0,100)}{msg.message?.length>100?'...':''}</p>
              <span className="msg-date">{new Date(msg.created_at).toLocaleDateString()}</span>
            </div>
          ))}
      </div>

      <style jsx>{`
        .stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:32px}
        .stat-card{padding:24px;display:flex;align-items:center;gap:16px}
        .stat-icon{width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:rgba(255,215,0,.08);border-radius:12px}
        .stat-val{display:block;font-size:1.8rem;font-weight:700;font-family:'Space Grotesk',sans-serif}
        .stat-lbl{font-size:.8rem;color:#888;text-transform:uppercase;letter-spacing:1px}
        .recent-section{padding:24px;margin-top:8px}
        .msg-item{padding:16px 0;border-bottom:1px solid rgba(255,255,255,.05)}
        .msg-item:last-child{border-bottom:none}
        .msg-header{display:flex;align-items:center;gap:8px;margin-bottom:4px}
        .msg-name{font-weight:600;font-size:.95rem}
        .msg-badge{padding:2px 8px;background:rgba(255,215,0,.15);color:#ffd700;border-radius:50px;font-size:.7rem;font-weight:600}
        .msg-email{font-size:.8rem;color:#888;margin-bottom:4px}
        .msg-text{font-size:.9rem;color:#aaa;margin-bottom:4px}
        .msg-date{font-size:.75rem;color:#555;font-family:'JetBrains Mono',monospace}
      `}</style>
    </div>
  );
}
