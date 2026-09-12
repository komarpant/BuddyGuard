"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import api from "@/lib/api";

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
  const { user, profile, updateProfile } = useAuth();
  
  const [alias, setAlias] = useState(profile?.alias || "Buddy");
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || "🦊");
  const [selectedColor, setSelectedColor] = useState(profile?.color || "#5B8DEF");
  const [privacyMode, setPrivacyMode] = useState(true);
  const [saved, setSaved] = useState(false);
  const [guardians, setGuardians] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: "", relationship: "Parent", whatsapp_number: "", phone_number: "" });

  const fetchGuardians = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/api/guardians/${user.id}`);
      setGuardians(response.guardians || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchGuardians();
    if (profile) {
      setAlias(profile.alias || "Buddy");
      setSelectedAvatar(profile.avatar || "🦊");
      setSelectedColor(profile.color || "#5B8DEF");
    }
  }, [profile, user]);

  const handleAddGuardian = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/guardians", { user_id: user.id, ...form });
      setShowAddModal(false);
      setForm({ name: "", relationship: "Parent", whatsapp_number: "", phone_number: "" });
      fetchGuardians();
    } catch (err) { alert("Failed to add"); }
  };

  const handleDeleteGuardian = async (id) => {
    if (!confirm("Remove this contact?")) return;
    try {
      await api.delete(`/api/guardians/${id}`);
      fetchGuardians();
    } catch (err) { alert("Failed to delete"); }
  };

  const getColor = (rel) => {
    const c = { Parent: "#5B8DEF", Therapist: "#008170", Official: "#D4A24C", Teacher: "#9B7FE6", Friend: "#4DBAB2" };
    return c[rel] || "#7B8FA3";
  };

  const handleSave = () => {
    updateProfile({
      alias,
      avatar: selectedAvatar,
      color: selectedColor
    });
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
            {guardians.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", padding: "12px", textAlign: "center" }}>No emergency contacts added yet.</p>
            ) : (
              guardians.map(g => (
                <div key={g.id} className="contact-item">
                  <div className="contact-avatar" style={{ background: `${getColor(g.relationship)}22`, color: getColor(g.relationship) }}>
                    {g.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">{g.name}</div>
                    <div className="contact-role">{g.relationship}</div>
                  </div>
                  <button className="icon-btn delete" onClick={() => handleDeleteGuardian(g.id)} title="Delete Contact">🗑️</button>
                </div>
              ))
            )}
            <button className="btn btn-secondary" onClick={() => setShowAddModal(true)} style={{ width: "100%", marginTop: "8px" }}>
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

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass animate-fade-in">
            <h2>Add Emergency Contact</h2>
            <form onSubmit={handleAddGuardian}>
              <div className="form-group-modal">
                <label>Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Dad" />
              </div>
              <div className="form-group-modal">
                <label>Relationship</label>
                <select value={form.relationship} onChange={e => setForm({...form, relationship: e.target.value})}>
                  <option>Parent</option><option>Therapist</option><option>Teacher</option>
                  <option>Official</option><option>Friend</option><option>Other</option>
                </select>
              </div>
              <div className="form-group-modal">
                <label>WhatsApp Number</label>
                <input required value={form.whatsapp_number} onChange={e => setForm({...form, whatsapp_number: e.target.value})} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group-modal">
                <label>Phone Number</label>
                <input required value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} placeholder="+91 98765 43210" />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

        .icon-btn { background: none; border: none; font-size: 16px; cursor: pointer; padding: 6px; border-radius: 8px; transition: 0.2s; }
        .icon-btn:hover { background: #F1F5F9; }
        .icon-btn.delete:hover { background: #FEE2E2; color: #EF4444; }

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

        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
        .modal-content { width: 100%; max-width: 440px; background: white; padding: 32px; border-radius: 24px; box-shadow: 0 24px 48px rgba(0,0,0,0.2); }
        .modal-content h2 { margin-bottom: 24px; font-size: 22px; color: #1A1A2E; }
        .form-group-modal { margin-bottom: 16px; text-align: left; }
        .form-group-modal label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #475569; }
        .form-group-modal input, .form-group-modal select { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #E2E8F0; background: #F8FAFC; font-family: inherit; font-size: 15px; color: #1A1A2E; }
        .form-group-modal input:focus, .form-group-modal select:focus { outline: none; border-color: #5B8DEF; background: white; box-shadow: 0 0 0 3px rgba(91,141,239,0.1); }
        .modal-actions { display: flex; gap: 12px; margin-top: 32px; }
        .modal-actions button { flex: 1; padding: 14px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: 0.2s; }
        .cancel-btn { background: #F1F5F9; color: #475569; border: none; }
        .cancel-btn:hover { background: #E2E8F0; }
        .save-btn { background: #1A1A2E; color: white; border: none; }
        .save-btn:hover { background: #0F172A; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
      `}</style>
    </div>
  );
}
