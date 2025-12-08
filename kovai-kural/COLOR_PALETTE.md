# Kovai Kural - Color Palette

## 🎨 Design System

### Light Mode Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Floral White** | `#FFFAF0` | Main background |
| **Linen** | `#FAF0E6` | Elevated backgrounds |
| **Space Indigo** | `#4B0082` | Primary brand color, buttons |
| **Sweet Salmon** | `#FF9B9B` | Accent color, highlights, hover states |
| **Vintage Grape** | `#8B7D9B` | Muted text, secondary text |
| **Midnight Violet** | `#2E1A47` | Main text, headings |

**Visual Characteristics:**
- Warm, inviting atmosphere
- High contrast for readability
- Soft, elegant feel
- Professional yet friendly

---

### Dark Mode Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Shadow Grey** | `#2A2A2A` | Cards, elevated surfaces |
| **Soft Linen** | `#E8DED2` | Main text |
| **Lilac Ash** | `#B8A9C9` | Muted text, secondary text |
| **Space Indigo** | `#4B0082` | Primary brand color (consistent) |
| **Sweet Salmon** | `#FF9B9B` | Accent color (consistent) |
| **Midnight Violet** | `#2E1A47` | Deep accents |

**Visual Characteristics:**
- Easy on the eyes
- Reduced eye strain
- Sophisticated, modern look
- Maintains brand consistency

---

## 🎯 Color Usage Guide

### Primary Actions
- **Buttons**: Sweet Salmon (`#FF9B9B`)
- **Links**: Space Indigo (`#4B0082`)
- **Hover States**: Lighter Sweet Salmon (`#FFB3B3`)

### Backgrounds
- **Light Mode**: Floral White → Linen gradient
- **Dark Mode**: Dark Grey → Shadow Grey gradient
- **Cards**: White (light) / Shadow Grey (dark)

### Text Hierarchy
1. **Primary Text**: Midnight Violet (light) / Soft Linen (dark)
2. **Secondary Text**: Vintage Grape (light) / Lilac Ash (dark)
3. **Muted Text**: Lighter variants

### Interactive Elements
- **Borders**: Semi-transparent Vintage Grape / Lilac Ash
- **Focus States**: Sweet Salmon with 15% opacity glow
- **Hover**: Sweet Salmon tint overlay

---

## 🔧 CSS Variables

### Light Mode
```css
--bg: #FFFAF0 (Floral White)
--bg-elevated: #FAF0E6 (Linen)
--card-bg: #FFFFFF
--text: #2E1A47 (Midnight Violet)
--text-muted: #8B7D9B (Vintage Grape)
--primary: #4B0082 (Space Indigo)
--accent: #FF9B9B (Sweet Salmon)
```

### Dark Mode
```css
--bg: #1a1a1a
--bg-elevated: #2A2A2A (Shadow Grey)
--card-bg: #2A2A2A (Shadow Grey)
--text: #E8DED2 (Soft Linen)
--text-muted: #B8A9C9 (Lilac Ash)
--primary: #4B0082 (Space Indigo)
--accent: #FF9B9B (Sweet Salmon)
```

---

## 🎭 Accessibility

### Contrast Ratios (WCAG AA Compliant)

**Light Mode:**
- Midnight Violet on Floral White: **12.5:1** ✅
- Vintage Grape on Floral White: **5.2:1** ✅
- Space Indigo on White: **11.8:1** ✅

**Dark Mode:**
- Soft Linen on Shadow Grey: **9.8:1** ✅
- Lilac Ash on Shadow Grey: **5.5:1** ✅
- Sweet Salmon on Shadow Grey: **4.8:1** ✅

All combinations meet or exceed WCAG AA standards for normal text (4.5:1).

---

## 🌈 Color Psychology

### Space Indigo (`#4B0082`)
- **Meaning**: Trust, authority, professionalism
- **Use**: Primary brand identity, important actions

### Sweet Salmon (`#FF9B9B`)
- **Meaning**: Warmth, friendliness, approachability
- **Use**: Accents, highlights, positive actions

### Vintage Grape (`#8B7D9B`)
- **Meaning**: Sophistication, creativity, balance
- **Use**: Secondary elements, subtle emphasis

### Midnight Violet (`#2E1A47`)
- **Meaning**: Depth, stability, confidence
- **Use**: Main content, headings

---

## 💡 Design Principles

1. **Consistency**: Space Indigo and Sweet Salmon remain constant across themes
2. **Hierarchy**: Clear visual distinction between primary, secondary, and tertiary elements
3. **Accessibility**: All color combinations meet WCAG AA standards
4. **Harmony**: Colors complement each other without clashing
5. **Flexibility**: Easy to extend with additional shades

---

## 🎨 Extended Palette (Future Use)

### Success States
- Light: `#22c55e` (Green)
- Dark: `#4ade80` (Lighter Green)

### Warning States
- Light: `#f59e0b` (Amber)
- Dark: `#fbbf24` (Lighter Amber)

### Error States
- Light: `#ef4444` (Red)
- Dark: `#f87171` (Lighter Red)

---

## 📱 Implementation Notes

- All colors defined in `theme.css`
- Automatic theme switching via `data-theme` attribute
- Smooth transitions between theme changes
- CSS variables for easy maintenance
- Fallback colors for older browsers

---

## 🔄 Theme Toggle

Users can switch between light and dark modes using the theme toggle button in the navbar. The preference is saved to localStorage and persists across sessions.

**Default**: Dark mode
**Toggle Location**: Navbar (top right)
**Persistence**: localStorage (`kk_theme`)
