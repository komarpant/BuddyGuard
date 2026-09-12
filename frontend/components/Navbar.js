"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "#008170"
  },
  {
    href: "/report",
    label: "Report",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: "#9B7FE6"
  },
  {
    href: "/guardian",
    label: "Guardian",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: "#4DBAB2"
  },
  {
    href: "/official",
    label: "Official",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    color: "#7B8FA3"
  },
  {
    href: "/sos",
    label: "SOS",
    danger: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    color: "#E87461"
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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

      {/* Sidebar now strictly relies on CSS hover for expansion */}
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
                className={`nav-link ${isActive ? "active" : ""} ${item.danger ? "danger" : ""}`}
                style={{
                  '--hover-color': item.color,
                  '--active-bg': `${item.color}15`,
                  '--active-border': item.color
                }}
              >
                <span className="icon-container">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="footer">
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className={`profile-link ${pathname === "/profile" ? "active" : ""}`}
          >
            <div className="avatar shadow-glow">B</div>
            <div className="profile-info">
              <span className="profile-name">Buddy</span>
              <span className="profile-status"><span className="dot" /> Online</span>
            </div>
          </Link>
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

        /* ===== Base Sidebar (Collapsed Default) ===== */
        .sidebar {
          position: fixed;
          top: 16px; left: 16px; bottom: 16px;
          width: 88px; /* Starts perfectly collapsed */
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 251, 252, 0.95) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(228, 228, 231, 0.8);
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0,0,0,0.03);
          display: flex; flex-direction: column;
          z-index: 1003;
          transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); /* Springy bounce */
          overflow: hidden; /* Clips the text when collapsed */
        }

        /* ===== Expand on Hover ===== */
        .sidebar:hover, .sidebar.open {
          width: 260px;
        }

        /* ===== Smooth Fade for Text Elements ===== */
        .brand-text, .label, .profile-info {
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.2s ease, transform 0.3s ease;
          white-space: nowrap;
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
          transition: opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s; /* Slight delay ensures sidebar opens first */
        }

        /* Layout specific paddings to align icons to the center of the 88px width */
        .brand {
          display: flex; align-items: center; 
          padding: 24px 22px 16px;
          min-height: 72px;
        }
        .brand-link {
          display: flex; flex-direction: row; align-items: center; gap: 14px;
          text-decoration: none; color: #1A1A2E;
        }
        .brand-icon {
          font-size: 24px; line-height: 1; flex-shrink: 0;
          width: 42px; height: 42px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #008170 0%, #5B8DEF 100%);
          border-radius: 12px;
        }
        .brand-name {
          font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(90deg, #1A1A2E 0%, #414E59 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .brand-tagline {
          font-size: 11px; color: #8E90A6; font-weight: 600;
          letter-spacing: 0.5px; margin-top: 2px;
        }

        .nav {
          flex: 1; padding: 12px 16px; overflow-y: auto;
          display: flex; flex-direction: column; gap: 8px;
        }

        .nav-link {
          display: flex; align-items: center; gap: 16px;
          padding: 14px 16px;
          border-radius: 14px;
          color: #74818C;
          text-decoration: none;
          font-size: 15px; font-weight: 600;
          transition: all 0.25s ease;
          border: 1px solid transparent;
        }
        
        .icon-container {
          display: flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; flex-shrink: 0;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          background: rgba(244, 244, 245, 0.6);
          color: #1A1A2E;
        }
        .nav-link:hover .icon-container {
          color: var(--hover-color);
        }

        .nav-link.active {
          color: #1A1A2E;
          background: var(--active-bg);
          border-color: rgba(0,0,0,0.03);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .nav-link.active .icon-container {
          color: var(--active-border);
        }

        .nav-link.danger { color: #E87461; }
        .nav-link.danger:hover { background: #FFF1F0; color: #DC2626; }
        .nav-link.danger.active {
          background: linear-gradient(90deg, #FFF1F0 0%, #FEF2F2 100%);
          color: #DC2626; border-left: 4px solid #DC2626;
        }

        .footer {
          padding: 16px 18px;
          border-top: 1px solid rgba(228, 228, 231, 0.6);
          background: rgba(255, 255, 255, 0.5);
        }
        .profile-link {
          display: flex; align-items: center; gap: 14px;
          padding: 10px 8px;
          border-radius: 14px;
          text-decoration: none; color: inherit;
          transition: all 0.2s ease;
          background: #FFFFFF;
          border: 1px solid rgba(228, 228, 231, 0.6);
        }
        .profile-link:hover {
          background: #F8F9FB;
          border-color: #D4D4D8;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .profile-link.active {
          background: linear-gradient(135deg, #F0FAF8 0%, #FFFFFF 100%);
          border-color: #A7F3D0;
        }
        .avatar {
          width: 34px; height: 34px;
          border-radius: 12px;
          background: linear-gradient(135deg, #008170 0%, #5CBFA0 100%);
          color: #fff;
          font-weight: 700; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .profile-name { font-size: 14px; font-weight: 700; color: #1A1A2E; }
        .profile-status {
          font-size: 12px; color: #74818C; font-weight: 500;
          display: flex; align-items: center; gap: 6px;
          margin-top: 2px;
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
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            width: var(--nav-width, 280px);
            border-left: none;
          }
          .sidebar.open { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}