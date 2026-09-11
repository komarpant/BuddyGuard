"use client";

import { useState } from "react";

const avatars = ["🦊", "🐱", "🐻", "🐼", "🐸", "🦁", "🐨", "🐯", "🦄", "🐙"];
const accentColors = [
  { name: "Ocean Blue", value: "#5B8DEF" },
  { name: "Lavender", value: "#9B7FE6" },
  { name: "Coral", value: "#E87461" },
  { name: "Mint", value: "#5CBFA0" },
  { name: "Amber", value: "#D4A24C" },
  { name: "Rose", value: "#E4729A" },
  { name: "Teal", value: "#4DBAB2" },
  { name: "Slate", value: "#7B8FA3" },
];

export default function ProfilePage() {
  const [alias, setAlias] = useState("Buddy");
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");
  const [selectedColor, setSelectedColor] = useState("#5B8DEF");
  const [privacyMode, setPrivacyMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="profile-page">
      <div className="animate-fade-in">
        <h1 className="section-title" style={{ fontSize: "24px" }}>🔒 Profile & Privacy</h1>
        <p className="section-subtitle">Customize your identity and privacy settings</p>

        {/* Avatar & Alias */}
        <section className="profile-section card-flat">
          <h2 className="profile-section-title">Your Identity</h2>

          <div className="avatar-preview">
            <div className="avatar-large" style={{ background: `${selectedColor}20`, borderColor: selectedColor }}>
              <span>{selectedAvatar}</span>
            </div>
            <div className="avatar-name">{alias || "Anonymous"}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Alias Name</label>
            <input
              className="input"
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Choose a nickname..."
              maxLength={20}
            />
            <span className="form-hint">This is how you appear in conversations. Not your real name.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Choose Avatar</label>
            <div className="avatar-grid">
              {avatars.map((av) => (
                <button
                  key={av}
                  className={`avatar-btn ${selectedAvatar === av ? "avatar-selected" : ""}`}
                  onClick={() => setSelectedAvatar(av)}
                  style={selectedAvatar === av ? { borderColor: selectedColor, background: `${selectedColor}15` } : {}}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Accent Color</label>
            <div className="color-grid">
              {accentColors.map((c) => (
                <button
                  key={c.value}
                  className={`color-btn ${selectedColor === c.value ? "color-selected" : ""}`}
                  onClick={() => setSelectedColor(c.value)}
                  title={c.name}
                >
                  <span className="color-swatch" style={{ background: c.value }} />
                  <span className="color-name">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="profile-section card-flat">
          <h2 className="profile-section-title">Privacy Settings</h2>

          <div className="toggle-row">
            <div>
              <div className="toggle-label">Anonymous Mode</div>
              <div className="toggle-desc">
                Chat anonymously. Your identity is hidden unless a Critical Emergency is detected.
              </div>
            </div>
            <button
              className={`toggle ${privacyMode ? "toggle-on" : "toggle-off"}`}
              onClick={() => setPrivacyMode(!privacyMode)}
            >
              <span className="toggle-knob" />
            </button>
          </div>

          <div className="privacy-note">
            <span className="privacy-note-icon">ℹ️</span>
            <p>
              Your conversation history is <strong>only visible to you</strong>. It is never shared with
              guardians, officials, or anyone else unless you choose to share it (e.g., with a therapist).
            </p>
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="profile-section card-flat">
          <h2 className="profile-section-title">Emergency Contacts</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
            These people are notified when you hit SOS or a Critical Emergency is detected.
          </p>

          <div className="contact-list">
            <div className="contact-item">
              <div className="contact-avatar" style={{ background: "rgba(91, 141, 239, 0.2)" }}>👨</div>
              <div className="contact-info">
                <div className="contact-name">Dad</div>
                <div className="contact-role">Emergency Contact</div>
              </div>
              <span className="badge badge-safe">Active</span>
            </div>
            <div className="contact-item">
              <div className="contact-avatar" style={{ background: "rgba(228, 114, 154, 0.2)" }}>👩</div>
              <div className="contact-info">
                <div className="contact-name">Mom</div>
                <div className="contact-role">Guardian + Emergency</div>
              </div>
              <span className="badge badge-safe">Active</span>
            </div>
            <button className="btn btn-secondary" style={{ width: "100%", marginTop: "8px" }}>
              + Add Contact
            </button>
          </div>
        </section>

        {/* Helplines */}
        <section className="profile-section card-flat">
          <h2 className="profile-section-title">📞 Helpline Numbers</h2>
          <div className="helpline-list">
            <div className="helpline-item">
              <span className="helpline-name">Childline India</span>
              <span className="helpline-number">1098</span>
            </div>
            <div className="helpline-item">
              <span className="helpline-name">Women Helpline</span>
              <span className="helpline-number">181</span>
            </div>
            <div className="helpline-item">
              <span className="helpline-name">Police</span>
              <span className="helpline-number">100</span>
            </div>
            <div className="helpline-item">
              <span className="helpline-name">iCall (Mental Health)</span>
              <span className="helpline-number">9152987821</span>
            </div>
          </div>
        </section>

        {/* Save */}
        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "8px" }}
          onClick={handleSave}
        >
          {saved ? "✅ Saved!" : "Save Changes"}
        </button>
      </div>

      <style jsx>{`
        .profile-page { max-width: 600px; margin: 0 auto; }

        .profile-section {
          padding: 24px;
          margin-bottom: 16px;
        }

        .profile-section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        .avatar-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .avatar-large {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          border: 3px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          transition: all var(--transition-normal);
        }

        .avatar-name {
          font-size: 18px;
          font-weight: 600;
        }

        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .form-hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; display: block; }

        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .avatar-btn {
          width: 100%;
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          border: 2px solid var(--border-default);
          background: var(--bg-secondary);
          font-size: 24px;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-btn:hover { border-color: var(--text-muted); transform: scale(1.05); }
        .avatar-selected { transform: scale(1.05); }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .color-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          background: var(--bg-secondary);
          cursor: pointer;
          font-family: inherit;
          transition: all var(--transition-fast);
        }

        .color-btn:hover { border-color: var(--text-muted); }
        .color-selected { border-color: var(--accent); background: rgba(91, 141, 239, 0.08); }

        .color-swatch {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .color-name {
          font-size: 12px;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .toggle-label { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .toggle-desc { font-size: 13px; color: var(--text-muted); line-height: 1.4; }

        .toggle {
          width: 50px;
          height: 28px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }

        .toggle-on { background: var(--accent); }
        .toggle-off { background: var(--ink-600); }

        .toggle-knob {
          position: absolute;
          top: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          transition: transform 0.2s ease;
        }

        .toggle-on .toggle-knob { transform: translateX(24px); }
        .toggle-off .toggle-knob { transform: translateX(3px); }

        .privacy-note {
          display: flex;
          gap: 10px;
          padding: 14px 16px;
          background: rgba(91, 141, 239, 0.08);
          border-radius: var(--radius-md);
          border: 1px solid rgba(91, 141, 239, 0.15);
        }

        .privacy-note-icon { flex-shrink: 0; }
        .privacy-note p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0; }

        .contact-list { display: flex; flex-direction: column; gap: 10px; }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
        }

        .contact-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .contact-info { flex: 1; }
        .contact-name { font-size: 14px; font-weight: 600; }
        .contact-role { font-size: 12px; color: var(--text-muted); }

        .helpline-list { display: flex; flex-direction: column; gap: 8px; }

        .helpline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .helpline-name { font-size: 14px; color: var(--text-secondary); }
        .helpline-number { font-size: 16px; font-weight: 700; color: var(--accent-light); }

        @media (max-width: 768px) {
          .color-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
