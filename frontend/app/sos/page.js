"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import api from "@/lib/api";

export default function SOSPage() {
  const { user } = useAuth();
  const [stage, setStage] = useState("ready"); // ready | confirm | triggered
  const [countdown, setCountdown] = useState(5);

  const triggerSOS = async () => {
    if (!user) return;
    try {
      await api.post("/api/sos", { user_id: user.id });
    } catch (err) {
      console.error("SOS API error:", err);
    }
  };

  const startSOS = () => {
    setStage("confirm");
    let count = 5;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        setStage("triggered");
        triggerSOS();
      }
    }, 1000);

    // Store timer so we can cancel
    window.__sosTimer = timer;
  };

  const cancelSOS = () => {
    if (window.__sosTimer) clearInterval(window.__sosTimer);
    setStage("ready");
    setCountdown(5);
  };

  return (
    <div className="sos-page">
      {stage === "ready" && (
        <div className="sos-ready animate-fade-in">
          <div className="sos-icon-container">
            <div className="sos-ring sos-ring-1" />
            <div className="sos-ring sos-ring-2" />
            <div className="sos-ring sos-ring-3" />
            <button className="sos-button" onClick={startSOS}>
              <span className="sos-text">SOS</span>
            </button>
          </div>

          <h1 className="sos-title">Emergency SOS</h1>
          <p className="sos-desc">
            Press the SOS button if you are in <strong>immediate physical danger</strong> —
            being followed, unsafe surroundings, or any situation where you need help right now.
          </p>

          <div className="sos-info">
            <div className="sos-info-item">
              <span className="sos-info-icon">📱</span>
              <div>
                <strong>Emergency Contacts</strong>
                <p>Your trusted people will be alerted instantly</p>
              </div>
            </div>
            <div className="sos-info-item">
              <span className="sos-info-icon">👮</span>
              <div>
                <strong>Officials Notified</strong>
                <p>Police / authorities will receive your alert</p>
              </div>
            </div>
            <div className="sos-info-item">
              <span className="sos-info-icon">📍</span>
              <div>
                <strong>Location Shared</strong>
                <p>Your location will be sent to responders</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {stage === "confirm" && (
        <div className="sos-confirm animate-fade-in">
          <div className="countdown-circle">
            <span className="countdown-number">{countdown}</span>
          </div>
          <h2 className="sos-title" style={{ color: "var(--status-critical)" }}>
            Sending SOS in {countdown}...
          </h2>
          <p className="sos-desc">
            Your emergency contacts and officials will be notified.
          </p>
          <button className="btn btn-secondary" onClick={cancelSOS} style={{ marginTop: "24px", padding: "14px 48px" }}>
            ✕ Cancel
          </button>
        </div>
      )}

      {stage === "triggered" && (
        <div className="sos-triggered animate-fade-in">
          <div className="triggered-icon">✅</div>
          <h2 className="sos-title" style={{ color: "var(--status-safe)" }}>
            SOS Alert Sent
          </h2>
          <p className="sos-desc">
            Your emergency contacts and officials have been notified.
            Help is on the way. Stay calm and stay where you are if safe.
          </p>

          <div className="triggered-status">
            <div className="status-row">
              <span>📱 Emergency Contacts</span>
              <span className="badge badge-safe">Notified</span>
            </div>
            <div className="status-row">
              <span>👮 Officials</span>
              <span className="badge badge-safe">Alerted</span>
            </div>
            <div className="status-row">
              <span>📍 Location</span>
              <span className="badge badge-info">Shared</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "32px", justifyContent: "center" }}>
            <button className="btn btn-secondary" onClick={() => { setStage("ready"); setCountdown(5); }}>
              Back to SOS
            </button>
            <Link href="/chat" className="btn btn-primary">
              💬 Talk to Buddy
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .sos-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 96px);
        }

        .sos-ready, .sos-confirm, .sos-triggered {
          text-align: center;
          max-width: 480px;
          padding: 20px;
        }

        .sos-icon-container {
          position: relative;
          width: 180px;
          height: 180px;
          margin: 0 auto 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sos-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid var(--status-critical);
          opacity: 0;
          animation: pulse-ring 3s ease-out infinite;
        }

        .sos-ring-1 { width: 100%; height: 100%; animation-delay: 0s; }
        .sos-ring-2 { width: 80%; height: 80%; animation-delay: 0.7s; }
        .sos-ring-3 { width: 60%; height: 60%; animation-delay: 1.4s; }

        .sos-button {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--status-critical);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 0 40px rgba(179, 69, 61, 0.4);
          z-index: 1;
        }

        .sos-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 60px rgba(179, 69, 61, 0.6);
          background: var(--status-critical-light);
        }

        .sos-button:active { transform: scale(0.98); }

        .sos-text {
          font-size: 32px;
          font-weight: 800;
          color: white;
          letter-spacing: 2px;
        }

        .sos-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .sos-desc {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .sos-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .sos-info-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border-radius: var(--radius-lg);
          background: var(--bg-card);
          border: 1px solid var(--border-default);
        }

        .sos-info-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
        .sos-info-item strong { font-size: 14px; display: block; margin-bottom: 2px; }
        .sos-info-item p { font-size: 13px; color: var(--text-muted); margin: 0; }

        .countdown-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 4px solid var(--status-critical);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 32px;
          animation: pulse-dot 1s ease-in-out infinite;
        }

        .countdown-number {
          font-size: 56px;
          font-weight: 700;
          color: var(--status-critical);
        }

        .triggered-icon {
          font-size: 64px;
          margin-bottom: 24px;
        }

        .triggered-status {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
          text-align: left;
        }

        .status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
