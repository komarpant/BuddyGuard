"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
    color: "#5B8DEF"
  },
  {
    href: "/chat",
    label: "Chat",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "#008170"
  },
  {
    href: "/report",
    label: "Report",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    color: "#D4A24C"
  },
  {
    href: "/history",
    label: "History",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: "#9B7FE6"
  },
  {
    href: "/guardians",
    label: "My Guardians",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "#4DBAB2"
  },
  {
    href: "/sos",
    label: "SOS",
    danger: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    color: "#EF4444"
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useAuth();
  
  const alias = profile?.alias || "Buddy";
  const avatar = profile?.avatar || "B";
  const color = profile?.color || "#008170";

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="mobile-header glass-effect">
        <Link href="/" className="mobile-brand">
          <div className="brand-icon-small">🛡️</div>
          <span>Buddy Guard</span>
        </Link>
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {mobileOpen
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>
            }
          </svg>
        </button>
      </header>

      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <Link href="/" className="brand-link" onClick={() => setMobileOpen(false)}>
            <div className="brand-icon shadow-glow">🛡️</div>
            <div className="brand-text">
              <span className="brand-name">BuddyGuard</span>
              <span className="brand-tagline">Safe & Protected</span>
            </div>
          </Link>
        </div>

        <nav className="nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-btn ${isActive ? "active" : ""} ${item.danger ? "danger" : ""}`}
                style={{
                  '--btn-color': item.color,
                }}
              >
                <span className="icon-container">{item.icon}</span>
                <span className="label">{item.label}</span>
                <div className="btn-bg"></div>
              </Link>
            );
          })}
        </nav>

        <div className="footer">
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className={`profile-btn ${pathname === "/profile" ? "active" : ""}`}
          >
            <div className="avatar shadow-glow" style={{ background: color }}>{avatar}</div>
            <div className="profile-info">
              <span className="profile-name">{alias}</span>
              <span className="profile-status"><span className="dot" /> Online</span>
            </div>
          </Link>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </aside>

      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        
        .shadow-glow {
          box-shadow: 0 8px 16px rgba(0, 129, 112, 0.25);
        }

        .mobile-header {
          display: none;
          position: fixed; top: 0; left: 0; right: 0;
          height: 60px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(228, 228, 231, 0.6);
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
          z-index: 1001;
        }

        .mobile-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: #1A1A2E;
          font-weight: 700; font-size: 17px;
          letter-spacing: -0.3px;
        }

        .brand-icon-small {
          background: linear-gradient(135deg, #008170 0%, #5CBFA0 100%);
          width: 32px; height: 32px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        .hamburger {
          background: none; border: none; color: #1A1A2E; cursor: pointer; padding: 4px;
          transition: transform 0.2s ease;
        }

        .hamburger:active { transform: scale(0.9); }

        .overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1002;
        }

        /* ===== New Premium Sidebar ===== */
        .sidebar {
          position: fixed;
          top: 20px; left: 20px; bottom: 20px;
          width: 84px; /* Starts collapsed */
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
          display: flex; flex-direction: column;
          z-index: 1003;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, background 0.4s ease;
          overflow: hidden;
        }

        /* ===== Expand on Hover ===== */
        .sidebar:hover, .sidebar.open {
          width: 280px;
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.7);
        }

        /* ===== Smooth Fade for Text Elements ===== */
        .brand-text, .label, .profile-info {
          white-space: nowrap;
          opacity: 0;
          transform: translateX(12px);
          transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }
        
        .sidebar:hover .brand-text, 
        .sidebar:hover .label, 
        .sidebar:hover .profile-info,
        .sidebar.open .brand-text, 
        .sidebar.open .label, 
        .sidebar.open .profile-info {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
          transition-delay: 0.05s;
        }

        /* ===== Brand Area ===== */
        .brand {
          padding: 24px 20px 16px;
          min-height: 82px;
        }
        .brand-link {
          display: flex; align-items: center; gap: 16px;
          text-decoration: none; color: #1A1A2E;
        }
        .brand-icon {
          font-size: 24px; line-height: 1; flex-shrink: 0;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #008170 0%, #5B8DEF 100%);
          border-radius: 14px;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 129, 112, 0.3);
        }
        .brand-name {
          font-size: 20px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(90deg, #1A1A2E 0%, #414E59 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: block;
        }
        .brand-tagline {
          font-size: 12px; color: #8E90A6; font-weight: 600;
          letter-spacing: 0.5px; display: block; margin-top: 2px;
        }

        /* ===== Nav Area ===== */
        .nav {
          flex: 1; padding: 12px 14px; overflow-y: auto; overflow-x: hidden;
          display: flex; flex-direction: column; gap: 8px;
        }

        /* ===== The Cool Buttons ===== */
        .nav-btn {
          display: flex; align-items: center;
          height: 54px;
          padding: 0 30px;
          border-radius: 16px;
          color: #74818C;
          text-decoration: none;
          font-size: 15px; font-weight: 600;
          position: relative;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
          z-index: 1;
        }

        /* Background Layer for Button */
        .btn-bg {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          z-index: -1;
          opacity: 0;
          transform: scale(0.95);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-btn:hover {
          color: var(--btn-color);
          transform: translateX(4px);
        }

        .nav-btn:hover .btn-bg {
          opacity: 1;
          transform: scale(1);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(255, 255, 255, 1);
        }

        .nav-btn.active {
          color: #FFFFFF;
        }
        
        .nav-btn.active .btn-bg {
          opacity: 1;
          transform: scale(1);
          background: var(--btn-color);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          border-color: transparent;
        }

        .nav-btn.danger:hover {
          color: #EF4444;
        }
        .nav-btn.danger.active {
          color: #FFFFFF;
        }
        .nav-btn.danger.active .btn-bg {
          background: #EF4444;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
        }

        /* Icon Animation */
        .icon-container {
          display: flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; flex-shrink: 0;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease;
        }

        .nav-btn:hover .icon-container {
          transform: scale(1.15) rotate(-2deg);
        }
        .nav-btn.active .icon-container {
          transform: scale(1.1);
        }

        .label {
          margin-left: 18px;
        }

        /* ===== Footer Area ===== */
        .footer {
          padding: 16px;
          border-top: 1px solid rgba(228, 228, 231, 0.5);
          background: rgba(255, 255, 255, 0.3);
        }
        
        .profile-btn {
          display: flex; align-items: center; gap: 16px;
          padding: 10px;
          border-radius: 16px;
          text-decoration: none; color: inherit;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: transparent;
          border: 1px solid transparent;
        }

        .profile-btn:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 1);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }

        .profile-btn.active {
          background: #FFFFFF;
          border-color: #A7F3D0;
          box-shadow: 0 8px 24px rgba(167, 243, 208, 0.4);
        }

        .avatar {
          width: 36px; height: 36px;
          border-radius: 12px;
          background: linear-gradient(135deg, #008170 0%, #5CBFA0 100%);
          color: #fff;
          font-weight: 700; font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .profile-info {
          display: flex; flex-direction: column;
        }
        
        .profile-name { font-size: 15px; font-weight: 700; color: #1A1A2E; }
        .profile-status {
          font-size: 12px; color: #74818C; font-weight: 500;
          display: flex; align-items: center; gap: 6px;
          margin-top: 2px;
        }
        
        .logout-btn {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 12px;
          border: none; background: transparent; color: #74818C;
          cursor: pointer; transition: all 0.3s ease; flex-shrink: 0;
          overflow: hidden; padding: 0;
        }

        .logout-btn:hover {
          background: #FFEAEA;
          color: #EF4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
        }

        .logout-text {
          white-space: nowrap; opacity: 0; transform: translateX(8px);
          font-size: 14px; font-weight: 600; width: 0; overflow: hidden;
          transition: all 0.3s ease;
        }

        .sidebar:hover .logout-btn, .sidebar.open .logout-btn {
          width: 100%; justify-content: flex-start; padding: 0 16px; gap: 12px;
          background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(228, 228, 231, 0.5);
          height: 48px; margin-top: 8px;
        }

        .sidebar:hover .logout-text, .sidebar.open .logout-text {
          opacity: 1; transform: translateX(0); width: auto;
        }

        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #22C55E;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
        }

        @media (max-width: 768px) {
          .mobile-header { display: flex; }
          .overlay { display: block; }
          .sidebar {
            top: 0; left: 0; bottom: 0;
            border-radius: 0 24px 24px 0;
            transform: translateX(-110%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            width: var(--nav-width, 280px);
            border-left: none;
            box-shadow: 10px 0 40px rgba(0,0,0,0.1);
          }
          .sidebar.open { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}