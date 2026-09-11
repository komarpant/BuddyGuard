"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Chat",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/sos",
    label: "SOS",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    danger: true,
  },
  {
    href: "/report",
    label: "Report",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  { type: "divider" },
  {
    href: "/guardian",
    label: "Guardian",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    href: "/official",
    label: "Official",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  { type: "divider" },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-nav-header">
        <Link href="/" className="mobile-logo">
          <span className="logo-icon">🛡️</span>
          <span className="logo-text">Buddy Guard</span>
        </Link>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="nav-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <nav className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo" onClick={() => setMobileOpen(false)}>
            <div className="logo-shield">🛡️</div>
            <div>
              <div className="logo-title">Buddy Guard</div>
              <div className="logo-subtitle">Your safe space</div>
            </div>
          </Link>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item, i) => {
            if (item.type === "divider") {
              return <div key={`div-${i}`} className="nav-divider" />;
            }

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-item ${isActive ? "nav-item-active" : ""} ${item.danger ? "nav-item-danger" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {isActive && <span className="nav-indicator" />}
              </Link>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">B</div>
            <div>
              <div className="user-name">Buddy</div>
              <div className="user-status">
                <span className="status-dot" />
                Online
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .mobile-nav-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-default);
          padding: 0 16px;
          align-items: center;
          justify-content: space-between;
          z-index: 1001;
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 16px;
        }

        .mobile-menu-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 4px;
        }

        .nav-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1002;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: var(--nav-width);
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-default);
          display: flex;
          flex-direction: column;
          z-index: 1003;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 24px 20px 16px;
          border-bottom: 1px solid var(--border-default);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-primary);
        }

        .logo-shield {
          font-size: 28px;
          line-height: 1;
        }

        .logo-title {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .logo-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 1px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-divider {
          height: 1px;
          background: var(--border-default);
          margin: 8px 10px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all var(--transition-fast);
          position: relative;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-item-active {
          color: var(--accent-light);
          background: rgba(91, 141, 239, 0.1);
        }

        .nav-item-active:hover {
          color: var(--accent-light);
          background: rgba(91, 141, 239, 0.15);
        }

        .nav-item-danger {
          color: var(--status-critical);
        }

        .nav-item-danger:hover {
          color: var(--status-critical-light);
          background: rgba(179, 69, 61, 0.1);
        }

        .nav-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--accent);
          border-radius: 0 3px 3px 0;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border-default);
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.03);
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-status {
          font-size: 11px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--status-safe);
        }

        @media (max-width: 768px) {
          .mobile-nav-header {
            display: flex;
          }

          .nav-overlay {
            display: block;
          }

          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
