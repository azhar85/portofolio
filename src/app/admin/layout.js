'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, User, Zap, FolderKanban, Building2, Briefcase, MessageSquare, Share2, LogOut, Menu, X } from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Profile', href: '/admin/profile', icon: User },
  { label: 'Skills', href: '/admin/skills', icon: Zap },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Businesses', href: '/admin/businesses', icon: Building2 },
  { label: 'Experiences', href: '/admin/experiences', icon: Briefcase },
  { label: 'Ongoing Work', href: '/admin/work', icon: FolderKanban },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Social Links', href: '/admin/social', icon: Share2 },
];

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && pathname !== '/admin/login') { router.push('/admin/login'); return; }
      setUser(session?.user || null);
      setLoading(false);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (!session && pathname !== '/admin/login') router.push('/admin/login');
    });
    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return children;
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#ffd700', fontSize: '1.2rem' }}>Loading...</div>;

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">

          <span className="sidebar-title">Admin</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="sidebar-nav">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <a key={link.href} href={link.href} className={`sidebar-link ${active ? 'sidebar-link-active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <Icon size={18} />{link.label}
              </a>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <a href="/" className="sidebar-link" target="_blank">View Portfolio</a>
          <button onClick={handleLogout} className="sidebar-link sidebar-logout"><LogOut size={18} />Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="topbar-menu" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          <span className="topbar-user">{user?.email}</span>
        </header>
        <div className="admin-content">{children}</div>
      </main>

      <style jsx>{`
        .admin-layout{display:flex;min-height:100vh;background:#0a0a0a}
        .admin-sidebar{width:260px;background:#111;border-right:1px solid rgba(255,215,0,.08);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:100;transition:transform .3s}
        .sidebar-header{padding:24px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.05)}
        .sidebar-logo{font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:700}
        .sidebar-title{color:#888;font-size:.85rem;font-weight:500}
        .sidebar-close{display:none;background:none;border:none;color:#888;cursor:pointer}
        .sidebar-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px;overflow-y:auto}
        .sidebar-link{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;color:#888;font-size:.9rem;font-weight:500;text-decoration:none;transition:all .2s;background:none;border:none;cursor:pointer;width:100%;text-align:left;font-family:'Inter',sans-serif}
        .sidebar-link:hover{color:#ffd700;background:rgba(255,215,0,.05)}
        .sidebar-link-active{color:#ffd700;background:rgba(255,215,0,.08)}
        .sidebar-footer{padding:16px 12px;border-top:1px solid rgba(255,255,255,.05);display:flex;flex-direction:column;gap:4px}
        .sidebar-logout{color:#ff4444!important}
        .sidebar-logout:hover{background:rgba(255,60,60,.05)!important}
        .admin-main{flex:1;margin-left:260px;min-height:100vh}
        .admin-topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,.05);background:rgba(17,17,17,.8);backdrop-filter:blur(20px);position:sticky;top:0;z-index:50}
        .topbar-menu{display:none;background:none;border:none;color:#ffd700;cursor:pointer}
        .topbar-user{color:#888;font-size:.85rem}
        .admin-content{padding:32px 24px}
        @media(max-width:768px){
          .admin-sidebar{transform:translateX(-100%)}
          .sidebar-open{transform:translateX(0)}
          .sidebar-close{display:block}
          .admin-main{margin-left:0}
          .topbar-menu{display:block}
        }
      `}</style>
    </div>
  );
}
