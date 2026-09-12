"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Chat",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/report",
    label: "Report",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "History",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/guardian",
    label: "Guardian",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    href: "/official",
    label: "Official",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    href: "/sos",
    label: "SOS",
    danger: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="mobile-header">
        <Link href="/" className="mobile-brand">
          🛡️ <span>Buddy Guard</span>
        </Link>
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>
            }
          </svg>
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>
        {/* Brand */}
        <div className="brand">
          <Link href="/" className="brand-link" onClick={() => setMobileOpen(false)}>
            <div className="brand-icon">🛡️</div>
            {!collapsed && (
              <div className="brand-text">
                <span className="brand-name">BuddyGuard</span>
                <span className="brand-tagline">Safe & Protected</span>
              </div>
            )}
          </Link>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {collapsed
                ? <polyline points="9 18 15 12 9 6" />
                : <polyline points="15 18 9 12 15 6" />
              }
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-link ${isActive ? "active" : ""} ${item.danger ? "danger" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && <span className="active-bar" />}
                <span className="icon">{item.icon}</span>
                {!collapsed && <span className="label">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="footer">
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className={`profile-link ${pathname === "/profile" ? "active" : ""}`}
            title={collapsed ? "Profile" : undefined}
          >
            <div className="avatar">B</div>
            {!collapsed && (
              <div className="profile-info">
                <span className="profile-name">Buddy</span>
                <span className="profile-status"><span className="dot" /> Online</span>
              </div>
            )}
          </Link>
        </div>
      </aside>

      <style jsx>{`
        /* ===== Mobile Header ===== */
        .mobile-header {
          display: none;
          position: fixed; top: 0; left: 0; right: 0;
          height: 54px;
          background: #FFFFFF;
          border-bottom: 1px solid #E4E4E7;
          padding: 0 16px;
          align-items: center;
          justify-content: space-between;
          z-index: 1001;
        }
        .mobile-brand {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; color: #1A1A2E;
          font-weight: 600; font-size: 15px;
        }
        .hamburger {
          background: none; border: none; color: #1A1A2E; cursor: pointer; padding: 4px;
        }
        .overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.2); z-index: 1002;
        }

        /* ===== Sidebar ===== */
        .sidebar {
          position: fixed;
          top: 12px; left: 12px; bottom: 12px;
          width: var(--nav-width);
          background: #FFFFFF;
          border: 1px solid #E8E8EB;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
          display: flex; flex-direction: column;
          z-index: 1003;
          transition: width 0.25s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
        }
        .sidebar.collapsed {
          width: var(--nav-width-collapsed);
        }

        /* ===== Brand ===== */
        .brand {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 18px 16px;
          min-height: 64px;
        }
        .brand-link {
          display: flex; flex-direction: row; align-items: center; gap: 12px;
          text-decoration: none; color: #1A1A2E;
          overflow: hidden;
          min-width: 0;
        }
        .brand-icon {
          font-size: 24px; line-height: 1; flex-shrink: 0;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: #008170;
          border-radius: 10px;
        }
        .brand-text {
          display: flex; flex-direction: column; white-space: nowrap; flex-shrink: 0;
        }
        .brand-name {
          font-size: 16px; font-weight: 700; letter-spacing: -0.4px;
          color: #1A1A2E;
        }
        .brand-tagline {
          font-size: 10px; color: #8E90A6; text-transform: uppercase;
          letter-spacing: 1px; margin-top: 1px;
        }
        .collapse-btn {
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: 1px solid #E4E4E7;
          border-radius: 6px; color: #8E90A6; cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .collapse-btn:hover {
          color: #555770; border-color: #ccc; background: #F4F4F5;
        }

        /* ===== Nav ===== */
        .nav {
          flex: 1; padding: 4px 10px; overflow-y: auto;
          display: flex; flex-direction: column; gap: 2px;
          justify-content: center;
        }

        .nav-link {
          position: relative;
          display: flex; align-items: center; gap: 14px;
          padding: 11px 14px;
          border-radius: 10px;
          color: #555770;
          text-decoration: none;
          font-size: 14px; font-weight: 450;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
          overflow: hidden;
        }
        .nav-link:hover {
          color: #1A1A2E;
          background: #F4F4F5;
        }
        .nav-link.active {
          color: #1A1A2E;
          background: #F0FAF8;
        }

        /* Active accent dot */
        .active-bar {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          width: 8px; height: 8px;
          background: #008170;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(0, 129, 112, 0.4);
        }

        /* Icon */
        .icon {
          display: flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; flex-shrink: 0;
        }
        .nav-link.active .icon {
          color: #008170;
        }

        /* SOS Danger */
        .nav-link.danger {
          color: #DC2626;
        }
        .nav-link.danger:hover {
          background: #FEF2F2;
          color: #B91C1C;
        }
        .nav-link.danger.active {
          background: #FEF2F2;
          color: #B91C1C;
        }
        .nav-link.danger.active .icon {
          color: #DC2626;
        }
        .nav-link.danger .active-bar {
          background: #DC2626;
        }
        .sos-badge {
          margin-left: auto;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #EF4444;
          color: #fff;
          font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          animation: pulse-sos 2s ease-in-out infinite;
        }

        @keyframes pulse-sos {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.9); }
        }

        /* ===== Footer / Profile ===== */
        .footer {
          padding: 10px;
          border-top: 1px solid #F0F0F2;
        }
        .profile-link {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none; color: inherit;
          transition: background 0.15s;
          overflow: hidden;
        }
        .profile-link:hover {
          background: #F4F4F5;
        }
        .profile-link.active {
          background: #F0FAF8;
        }
        .avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #008170;
          color: #fff;
          font-weight: 600; font-size: 13px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .profile-info {
          display: flex; flex-direction: column;
          white-space: nowrap; overflow: hidden;
        }
        .profile-name {
          font-size: 13px; font-weight: 500; color: #1A1A2E;
        }
        .profile-status {
          font-size: 11px; color: #8E90A6;
          display: flex; align-items: center; gap: 5px;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e;
        }

        /* ===== Collapsed tweaks ===== */
        .sidebar.collapsed .brand {
          justify-content: center; padding: 20px 0 16px;
        }
        .sidebar.collapsed .collapse-btn {
          display: none;
        }
        .sidebar.collapsed .nav-link {
          justify-content: center; padding: 11px 0;
        }
        .sidebar.collapsed .active-bar {
          left: 0;
        }
        .sidebar.collapsed .profile-link {
          justify-content: center; padding: 10px 0;
        }

        /* ===== Responsive ===== */
        @media (max-width: 768px) {
          .mobile-header { display: flex; }
          .overlay { display: block; }
          .sidebar {
            top: 0; left: 0; bottom: 0;
            border-radius: 0 16px 16px 0;
            transform: translateX(-110%);
            transition: transform 0.25s cubic-bezier(.4,0,.2,1);
            width: var(--nav-width);
          }
          .sidebar.open { transform: translateX(0); }
          .sidebar.collapsed { width: var(--nav-width); }
          .collapse-btn { display: none; }
        }
      `}</style>
    </>
  );
}
