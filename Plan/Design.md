# Buddy Guard — Design System

**Team:** Runtime Terror
**Track:** Bal Suraksha (Child Safety, Protection & Well-being)
**Event:** Bit N Build Hackathon (48-hour build)

---

## 1. Design Principles

Buddy Guard is a trust product before it's anything else — a child needs to feel safe enough to talk, and a guardian/official needs to trust the information they're seeing. The visual language should feel **calm, private, and dependable** — closer to a messaging app a child already trusts than a clinical safety dashboard. Avoid anything that feels like a hospital form, a government portal, or a "monitoring" tool — the app is a companion first, a safety system second.

- Muted, low-saturation tones over bright/alarming colors — even the Critical Emergency states should feel serious, not panic-inducing
- Generous spacing and soft contrast so long chat sessions feel comfortable
- Consistency across the Child, Guardian, and Official experiences, differentiated by information density, not by different visual languages

---

## 2. Color Palette — "Ink Soup"

Base palette, dark-to-light neutral scale:

| Swatch | Hex | Tint |
|---|---|---|
| ⬜ | `#B9C0C5` | 60% |
| ⬜ | `#97A0A9` | 40% |
| ⬜ | `#74818C` | 20% |
| ◼ | `#414E59` | 60% |
| ◼ | `#313A43` | 40% |
| ⬛ | `#20272C` | 20% |

**Usage:**
- `#20272C` / `#313A43` — primary dark surfaces, headers, official/guardian dashboard chrome, primary text on light backgrounds
- `#414E59` — secondary surfaces, cards, chat bubble backgrounds (AI side)
- `#74818C` / `#97A0A9` — secondary text, icons, borders, dividers
- `#B9C0C5` — light backgrounds, subtle fills, disabled states

**User-selectable color:** the neutral "Ink Soup" scale is the default system-wide theme (chrome, text, structure, dashboards). On top of it, each user can choose their own **accent color** — used for their own chat bubbles, buttons, and highlights, so the app feels personal to the child without the safety-critical parts of the UI (alerts, case status, SOS) ever changing color. Accent color is a personalization layer, not a semantic one — status colors (below) stay fixed regardless of the user's chosen accent, so meaning is never lost to preference.

**Status colors (fixed, not user-customizable):**

| State | Color | Notes |
|---|---|---|
| Critical Emergency | `#B3453D` (muted brick red) | Never bright/alarm red — serious, not panic-inducing |
| Distress / Bullying | `#C08A3E` (muted amber) | Warm, attention-worthy, not urgent-red |
| No Risk / Resolved | `#5C8C6E` (muted sage green) | Calm confirmation |
| Info / Neutral | `#74818C` | From the base palette |

---

## 3. Typography

Inspired by the restraint of WhatsApp and Apple Music's interfaces — a single, highly legible system font family, used consistently, with hierarchy built from weight and size rather than decoration.

**Primary typeface:** SF Pro (Apple platforms) / **Inter** as the cross-platform web equivalent
- Inter is the practical choice for a web app — it's free, open-source, has the same clean, humanist, high-legibility character as SF Pro, and renders consistently across Windows/Android/iOS browsers
- Fallback stack: `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif` — this lets Apple devices render native SF Pro automatically while everyone else gets Inter

**Why not a display/serif face:** this isn't a branding-forward marketing site — it's a tool people rely on in stressful moments. WhatsApp and Apple Music both default to their platform system font precisely because it disappears and lets content lead. Buddy Guard follows the same logic.

**Type scale:**

| Role | Size | Weight | Usage |
|---|---|---|---|
| Display | 28px | 600 (Semibold) | Onboarding, empty states |
| Title | 20px | 600 (Semibold) | Screen headers, case titles |
| Subtitle | 16px | 500 (Medium) | Section headers, dashboard labels |
| Body | 15px | 400 (Regular) | Chat messages, general content |
| Caption | 13px | 400 (Regular) | Timestamps, metadata, helper text |
| Button/Label | 15px | 500 (Medium) | Buttons, tabs, nav items |

**Line height:** 1.4–1.5 for body/chat text (readability over long conversations); 1.2 for headings.

**Letter spacing:** default (0) throughout — avoid tracked-out uppercase labels, which read as cold/systemic rather than warm and conversational.

---

## 4. Component Notes

- **Chat bubbles:** child's messages use their selected accent color; Buddy Guard's replies use `#414E59` on a light surface, or `#B9C0C5` in dark mode — always visually distinct but never competing for attention
- **Buttons:** solid fill for primary actions (Send, Report, Resolve Case), outlined for secondary actions, using the base neutral scale plus the user's accent for primary CTAs on the child's own screens
- **SOS button:** the one deliberate exception to the muted palette — uses the fixed Critical status color at higher saturation, sized and positioned so it's unmistakable and never confused with a normal action
- **Cards (dashboards):** flat fills from the neutral scale, minimal shadow, clear left-edge status color bar to indicate tier at a glance without relying on color alone (also pair with a text label for accessibility)
- **Dark mode:** the Ink Soup scale already reads naturally as a dark-mode-first palette (dark end `#20272C`/`#313A43` as base surfaces) — light mode simply inverts which end of the scale is "background" vs. "text"

---

## 5. Accessibility

- Never convey Behavioral Engine tier by color alone — always pair with a text label or icon
- Maintain WCAG AA contrast minimum (4.5:1 for body text) between text and background across both the fixed neutral palette and any user-selected accent color — validate accent color choices against this before allowing arbitrary hex input (e.g., restrict to a vetted swatch set, or auto-adjust lightness)
- Visible keyboard focus states throughout, especially on the SOS button and case-status controls
- Respect reduced-motion preferences for any transitions (case status changes, notification badges)
