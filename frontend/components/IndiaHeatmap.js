// frontend/components/IndiaHeatmap.js
"use client";

import { useState, useMemo } from "react";

// Mock India incident telemetry (Can be replaced with backend API calls)
const INITIAL_STATE_DATA = [
    { id: "MH", name: "Maharashtra", cases: 48, tier: "high" },
    { id: "DL", name: "Delhi NCR", cases: 42, tier: "high" },
    { id: "UP", name: "Uttar Pradesh", cases: 39, tier: "high" },
    { id: "KA", name: "Karnataka", cases: 27, tier: "moderate" },
    { id: "WB", name: "West Bengal", cases: 24, tier: "moderate" },
    { id: "TN", name: "Tamil Nadu", cases: 22, tier: "moderate" },
    { id: "GJ", name: "Gujarat", cases: 19, tier: "moderate" },
    { id: "RJ", name: "Rajasthan", cases: 17, tier: "moderate" },
    { id: "MP", name: "Madhya Pradesh", cases: 15, tier: "moderate" },
    { id: "PB", name: "Punjab", cases: 13, tier: "moderate" },
    { id: "HR", name: "Haryana", cases: 11, tier: "low" },
    { id: "BR", name: "Bihar", cases: 9, tier: "low" },
    { id: "KL", name: "Kerala", cases: 8, tier: "low" },
    { id: "TS", name: "Telangana", cases: 7, tier: "low" },
    { id: "OR", name: "Odisha", cases: 6, tier: "low" },
    { id: "AS", name: "Assam", cases: 5, tier: "low" },
    { id: "JH", name: "Jharkhand", cases: 4, tier: "low" },
    { id: "UT", name: "Uttarakhand", cases: 3, tier: "low" },
    { id: "GA", name: "Goa", cases: 2, tier: "low" },
    { id: "HP", name: "Himachal Pradesh", cases: 1, tier: "low" },
];

const TIER_COLORS = {
    high: {
        badge: "High Risk",
        bg: "#FEF2F2",
        border: "#EF4444",
        accent: "#DC2626",
        fill: "rgba(239, 68, 68, 0.85)",
    },
    moderate: {
        badge: "Moderate Risk",
        bg: "#FFFBEB",
        border: "#F59E0B",
        accent: "#D97706",
        fill: "rgba(245, 158, 11, 0.85)",
    },
    low: {
        badge: "Low Risk",
        bg: "#F0FDF4",
        border: "#22C55E",
        accent: "#15803D",
        fill: "rgba(34, 197, 94, 0.8)",
    },
};

export default function IndiaHeatmap({ userRole = "official" }) {
    const [selectedState, setSelectedState] = useState(INITIAL_STATE_DATA[0]);
    const [tierFilter, setTierFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Enforce role isolation: restricted from child and guardian
    if (userRole !== "official" && userRole !== "admin") {
        return (
            <div className="card-flat p-6 text-center text-red-500">
                <span className="text-2xl">🔒</span>
                <p className="mt-2 font-semibold">Access Restricted</p>
                <p className="text-xs text-gray-500">Incident telemetry maps are restricted to Official and Admin personnel.</p>
            </div>
        );
    }

    const filteredData = useMemo(() => {
        return INITIAL_STATE_DATA.filter((item) => {
            const matchesTier = tierFilter === "all" || item.tier === tierFilter;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTier && matchesSearch;
        });
    }, [tierFilter, searchQuery]);

    const stats = useMemo(() => {
        return {
            high: INITIAL_STATE_DATA.filter((s) => s.tier === "high").length,
            moderate: INITIAL_STATE_DATA.filter((s) => s.tier === "moderate").length,
            low: INITIAL_STATE_DATA.filter((s) => s.tier === "low").length,
            totalReports: INITIAL_STATE_DATA.reduce((acc, curr) => acc + curr.cases, 0),
        };
    }, []);

    return (
        <div className="heatmap-container card-flat">
            {/* Header & Badges */}
            <div className="header-bar">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🇮🇳</span>
                        <h3 className="section-title text-base mb-0">National Incident Heatmap</h3>
                    </div>
                    <p className="section-subtitle mb-0">
                        Categorized rate of reported cases across Indian states
                    </p>
                </div>
                <div className="badge-legend">
                    <span className="legend-chip high">
                        <span className="legend-dot bg-[#EF4444]" /> High ({stats.high})
                    </span>
                    <span className="legend-chip moderate">
                        <span className="legend-dot bg-[#F59E0B]" /> Moderate ({stats.moderate})
                    </span>
                    <span className="legend-chip low">
                        <span className="legend-dot bg-[#22C55E]" /> Low ({stats.low})
                    </span>
                </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="filter-controls">
                <input
                    type="text"
                    placeholder="Search state..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <div className="tier-buttons">
                    {["all", "high", "moderate", "low"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTierFilter(t)}
                            className={`filter-btn ${tierFilter === t ? "active" : ""}`}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Layout: Visual Density Grid + State Inspector */}
            <div className="heatmap-body">
                {/* State Density Heat Grid */}
                <div className="state-grid">
                    {filteredData.map((st) => {
                        const config = TIER_COLORS[st.tier];
                        const isSelected = selectedState?.id === st.id;
                        return (
                            <button
                                key={st.id}
                                onClick={() => setSelectedState(st)}
                                className={`state-card ${isSelected ? "selected" : ""}`}
                                style={{
                                    backgroundColor: config.bg,
                                    borderColor: isSelected ? config.border : "var(--border-default)",
                                }}
                            >
                                <div className="flex justify-between items-center w-full">
                                    <span className="font-semibold text-xs text-gray-800">{st.name}</span>
                                    <span
                                        className="cases-pill"
                                        style={{ backgroundColor: config.fill, color: "#fff" }}
                                    >
                                        {st.cases}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${Math.min(100, (st.cases / 50) * 100)}%`,
                                            backgroundColor: config.accent,
                                        }}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Selected State Overview Detail Card */}
                {selectedState && (
                    <div className="inspector-card">
                        <span className="text-xs text-muted uppercase font-bold tracking-wider">
                            State Details
                        </span>
                        <h4 className="text-lg font-bold text-gray-900 mt-1">{selectedState.name}</h4>
                        <div
                            className="tier-badge-pill"
                            style={{
                                backgroundColor: TIER_COLORS[selectedState.tier].bg,
                                borderColor: TIER_COLORS[selectedState.tier].border,
                                color: TIER_COLORS[selectedState.tier].accent,
                            }}
                        >
                            {TIER_COLORS[selectedState.tier].badge}
                        </div>

                        <div className="stat-box">
                            <span className="text-2xl font-black text-gray-800">{selectedState.cases}</span>
                            <span className="text-xs text-gray-500">Active Incidents Reported</span>
                        </div>

                        <div className="text-xs text-gray-500 leading-relaxed mt-2">
                            Rate classification based on density of automated distress triggers, cyberbullying screenshots, and SOS calls received within the jurisdiction [source: 1].
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .heatmap-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }
        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
        }
        .badge-legend {
          display: flex;
          gap: 8px;
        }
        .legend-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 600;
          border: 1px solid var(--border-default);
          background: #fff;
        }
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .filter-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .search-input {
          flex: 1;
          min-width: 180px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          font-size: 13px;
          outline: none;
        }
        .tier-buttons {
          display: flex;
          gap: 6px;
        }
        .filter-btn {
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--border-default);
          background: var(--bg-card);
          color: var(--text-secondary);
        }
        .filter-btn.active {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        .heatmap-body {
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: 16px;
        }
        .state-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 8px;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .state-card {
          padding: 10px;
          border-radius: var(--radius-md);
          border: 1.5px solid;
          cursor: pointer;
          text-align: left;
          transition: transform 0.15s ease;
          display: flex;
          flex-direction: column;
        }
        .state-card:hover {
          transform: translateY(-2px);
        }
        .state-card.selected {
          box-shadow: 0 0 0 2px rgba(0, 129, 112, 0.25);
        }
        .cases-pill {
          padding: 2px 6px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
        }
        .inspector-card {
          padding: 16px;
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          border: 1px solid var(--border-default);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tier-badge-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: var(--radius-full);
          border: 1px solid;
          width: fit-content;
        }
        .stat-box {
          display: flex;
          flex-direction: column;
          margin-top: 8px;
          padding: 8px;
          background: #fff;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
        }
        @media (max-width: 768px) {
          .heatmap-body {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}