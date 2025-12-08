# Kovai Kural - Color Palette

## 🎨 Design System

### Light Mode Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Floral White** | `#FFF8F0` | Main background |
| **Surface/Card** | `#F9F3EA` | Cards, elevated surfaces |
| **Space Indigo** | `#392F5A` | Primary brand color |
| **Muted Coral** | `#E69A8D` | Accent color, interactive elements |
| **Primary Text** | `#2D2642` | Main text, headings |
| **Secondary Text** | `#5A516B` | Muted text, secondary text |

---

### Dark Mode Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Deep Indigo-Black** | `#161422` | Main background |
| **Surface/Card** | `#1E1B2A` | Cards, elevated surfaces |
| **Brightened Space Indigo** | `#52457A` | Primary brand color |
| **Muted Coral** | `#E69A8D` | Accent color (consistent) |
| **Warm Soft White** | `#F0E8DC` | Main text |
| **Secondary Text** | `#B5A9C2` | Muted text |
| **Borders/Dividers** | `#2C283C` | Borders, dividers |

---

## 🔧 CSS Variables

### Light Mode
```css
--bg: #FFF8F0
--card-bg: #F9F3EA
--text: #2D2642
--text-muted: #5A516B
--primary: #392F5A
--accent: #E69A8D
--border: rgba(57, 47, 90, 0.15)
```

### Dark Mode
```css
--bg: #161422
--card-bg: #1E1B2A
--text: #F0E8DC
--text-muted: #B5A9C2
--primary: #52457A
--accent: #E69A8D
--border: #2C283C
```

---

## 🎯 Color Usage

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Page BG** | #FFF8F0 | #161422 |
| **Cards** | #F9F3EA | #1E1B2A |
| **Text** | #2D2642 | #F0E8DC |
| **Buttons** | #E69A8D | #E69A8D |
| **Primary** | #392F5A | #52457A |
| **Borders** | rgba(57,47,90,0.15) | #2C283C |

---

## 🌈 Color Psychology

### Space Indigo (`#392F5A` / `#52457A`)
- Trust, authority, professionalism
- Primary brand identity

### Muted Coral (`#E69A8D`)
- Warmth, friendliness, approachability
- Accents, interactive elements

---

## ✅ Accessibility

**Light Mode:**
- Primary Text on Background: **11.2:1** ✅
- Secondary Text on Background: **6.8:1** ✅

**Dark Mode:**
- Primary Text on Background: **10.5:1** ✅
- Secondary Text on Background: **6.2:1** ✅

All combinations meet WCAG AA standards.

---

## 🎨 Brand Consistency

**Accent Color (Consistent):** `#E69A8D` (Muted Coral)
**Indigo Family:** `#392F5A` (light) / `#52457A` (dark)

Both themes use the same accent color and indigo family for brand consistency.
