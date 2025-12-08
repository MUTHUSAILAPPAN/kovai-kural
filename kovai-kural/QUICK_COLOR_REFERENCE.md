# Quick Color Reference Card

## 🎨 At a Glance

### Light Mode Palette
```
🌸 Floral White  #FFFAF0  ← Background
📄 Linen         #FAF0E6  ← Elevated surfaces
💜 Space Indigo  #4B0082  ← Primary/Brand
🌸 Sweet Salmon  #FF9B9B  ← Accent/Hover
🍇 Vintage Grape #8B7D9B  ← Muted text
🌙 Midnight Violet #2E1A47 ← Main text
```

### Dark Mode Palette
```
⬛ Shadow Grey   #2A2A2A  ← Cards/Surfaces
🤍 Soft Linen    #E8DED2  ← Main text
💜 Lilac Ash     #B8A9C9  ← Muted text
💜 Space Indigo  #4B0082  ← Primary/Brand
🌸 Sweet Salmon  #FF9B9B  ← Accent/Hover
🌙 Midnight Violet #2E1A47 ← Deep accents
```

---

## 🎯 Quick Usage

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Page BG** | Floral White | Dark Grey (#1a1a1a) |
| **Cards** | White | Shadow Grey |
| **Text** | Midnight Violet | Soft Linen |
| **Buttons** | Sweet Salmon | Sweet Salmon |
| **Links** | Space Indigo | Space Indigo |
| **Borders** | Vintage Grape (30%) | Lilac Ash (20%) |

---

## ⚡ CSS Variables

```css
/* Universal */
--primary: #4B0082 (Space Indigo)
--accent: #FF9B9B (Sweet Salmon)

/* Light Mode */
--bg: #FFFAF0
--text: #2E1A47
--text-muted: #8B7D9B

/* Dark Mode */
--bg: #1a1a1a
--text: #E8DED2
--text-muted: #B8A9C9
```

---

## 🎨 Color Meanings

| Color | Emotion | Use Case |
|-------|---------|----------|
| Space Indigo | Trust, Authority | Brand, Primary Actions |
| Sweet Salmon | Warmth, Friendly | Accents, Highlights |
| Vintage Grape | Sophisticated | Secondary Text |
| Midnight Violet | Stable, Deep | Main Content |

---

## ✨ Key Features

✅ WCAG AA Compliant
✅ Consistent across themes
✅ Smooth transitions
✅ Accessible contrast
✅ Professional & friendly

---

## 🔄 Theme Toggle

**Location**: Navbar (top right)
**Icon**: 🌙 Dark / ☀ Light
**Storage**: localStorage
**Default**: Dark mode

---

## 📝 Quick Tips

1. **Always use CSS variables** - Never hardcode colors
2. **Test both themes** - Ensure consistency
3. **Check contrast** - Use browser dev tools
4. **Smooth transitions** - Add `transition: all 0.15s ease`
5. **Hover states** - Use `--accent` or `--hover-bg`

---

## 🎯 Common Patterns

### Button
```css
background: var(--accent);
color: white;
border-radius: 999px;
transition: all 0.15s ease;
```

### Card
```css
background: var(--card-bg);
border: 1px solid var(--border);
border-radius: 16px;
box-shadow: var(--shadow);
```

### Input Focus
```css
border-color: var(--accent);
box-shadow: 0 0 0 3px rgba(255, 155, 155, 0.15);
```

---

## 🚀 Files to Edit

When adding new components:
1. Use variables from `theme.css`
2. Test in both light and dark modes
3. Add hover/focus states
4. Include smooth transitions
5. Maintain consistent spacing

---

## 💡 Remember

**Brand Colors (Never Change):**
- Space Indigo: `#4B0082`
- Sweet Salmon: `#FF9B9B`

**Theme-Specific (Changes with theme):**
- Background colors
- Text colors
- Border colors
- Shadow intensity
