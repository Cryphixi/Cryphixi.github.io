# Website Color Palette Reference

This document lists all the main colors used throughout the website. All colors are defined as CSS variables in `css/styles.css` and can be easily customized.

## 🎨 Professional Theme Colors

| Variable | Hex Code | Usage | Preview |
|----------|----------|-------|---------|
| `--bg-primary` | `#0a192f` | Main background color (dark navy blue) | ![#0a192f](https://via.placeholder.com/50/0a192f/0a192f.png) |
| `--bg-secondary` | `#483A58` | Secondary background (cards, nav bars, purple-gray) | ![#483A58](https://via.placeholder.com/50/483A58/483A58.png) |
| `--text-primary` | `#ccd6f6` | Primary text color (light blue-gray, main headings) | ![#ccd6f6](https://via.placeholder.com/50/ccd6f6/ccd6f6.png) |
| `--text-secondary` | `#A8A1F7` | Secondary text color (light purple, body text) | ![#A8A1F7](https://via.placeholder.com/50/A8A1F7/A8A1F7.png) |
| `--accent` | `#978EF5` | Accent color (purple, links, buttons, highlights) | ![#978EF5](https://via.placeholder.com/50/978EF5/978EF5.png) |
| `--accent-hover` | `#837AE3` | Accent hover state (darker purple) | ![#837AE3](https://via.placeholder.com/50/837AE3/837AE3.png) |

## 🎮 Pixel Theme Colors

| Variable | Hex Code | Usage | Preview |
|----------|----------|-------|---------|
| `--bg-primary` | `#1a1a2e` | Main background color (dark purple-blue) | ![#1a1a2e](https://via.placeholder.com/50/1a1a2e/1a1a2e.png) |
| `--bg-secondary` | `#483A58` | Secondary background (cards, nav bars, purple-gray) | ![#483A58](https://via.placeholder.com/50/483A58/483A58.png) |
| `--text-primary` | `#eaeaea` | Primary text color (light gray) | ![#eaeaea](https://via.placeholder.com/50/eaeaea/eaeaea.png) |
| `--text-secondary` | `#A8A1F7` | Secondary text color (light purple) | ![#A8A1F7](https://via.placeholder.com/50/A8A1F7/A8A1F7.png) |
| `--accent` | `#978EF5` | Accent color (purple) | ![#978EF5](https://via.placeholder.com/50/978EF5/978EF5.png) |
| `--accent-hover` | `#837AE3` | Accent hover state (darker purple) | ![#837AE3](https://via.placeholder.com/50/837AE3/837AE3.png) |

## 📍 Where Colors Are Used

### Background Colors
- **`--bg-primary`**: 
  - Main page background
  - Body background
  - Game area background
  
- **`--bg-secondary`**: 
  - Navigation bars (with transparency)
  - Card backgrounds
  - Footer background
  - Scrollbar track

### Text Colors
- **`--text-primary`**: 
  - Main headings (h1, h2, h3)
  - Navigation links (when active)
  - Card titles
  - Important text
  
- **`--text-secondary`**: 
  - Body text/paragraphs
  - Navigation links (when inactive)
  - Footer text
  - Descriptions and secondary content

### Accent Colors
- **`--accent`**: 
  - Active navigation links
  - Buttons (primary and outline)
  - Links and hover states
  - Section number labels (e.g., "01.", "02.")
  - Technology tags
  - Scrollbar thumb
  - Star animations in background
  - Border highlights
  
- **`--accent-hover`**: 
  - Button hover states
  - Link hover states
  - Scrollbar thumb hover

## 🎨 How to Change Colors

### Quick Change
Edit the CSS variables in `css/styles.css`:

```css
:root {
  /* Professional Theme */
  --bg-primary: #YOUR_COLOR;
  --bg-secondary: #YOUR_COLOR;
  --text-primary: #YOUR_COLOR;
  --text-secondary: #YOUR_COLOR;
  --accent: #YOUR_COLOR;
  --accent-hover: #YOUR_COLOR;
}

[data-theme="pixel"] {
  /* Pixel Theme */
  --bg-primary: #YOUR_COLOR;
  --bg-secondary: #YOUR_COLOR;
  --text-primary: #YOUR_COLOR;
  --text-secondary: #YOUR_COLOR;
  --accent: #YOUR_COLOR;
  --accent-hover: #YOUR_COLOR;
}
```

### Color Suggestions

**For a warmer theme:**
- Background: Dark browns/grays (`#1a1a1a`, `#2d2d2d`)
- Accent: Orange/amber (`#ff6b35`, `#f7931e`)

**For a cooler theme:**
- Background: Dark blues (`#0d1117`, `#161b22`)
- Accent: Blue/cyan (`#58a6ff`, `#79c0ff`)

**For a purple theme:**
- Background: Dark purples (`#1e1e2e`, `#2a2a3e`)
- Accent: Purple/pink (`#bb86fc`, `#c792ea`)

**For a minimal theme:**
- Background: Dark grays (`#0f0f0f`, `#1a1a1a`)
- Accent: White/light gray (`#ffffff`, `#e0e0e0`)

## 🔍 Finding Colors in Code

All colors are defined in:
- **File**: `css/styles.css`
- **Lines**: 2-20 (CSS variable definitions)

Colors are used via `var(--variable-name)` throughout:
- `css/styles.css` - Main stylesheet
- `css/animations.css` - Animation styles
- HTML files - Inline styles (can be converted to use variables)

## 💡 Tips

1. **Maintain Contrast**: Ensure text colors have sufficient contrast against backgrounds for accessibility
2. **Test Both Themes**: Changes affect both professional and pixel themes
3. **Accent Consistency**: Keep accent and accent-hover colors in the same color family
4. **Preview**: Use browser dev tools to test color changes in real-time

## 🎯 Current Color Scheme Summary

**Professional Theme**: Dark navy background with purple accents
**Pixel Theme**: Dark purple-blue background with purple accents

Both themes use a dark background with light text and vibrant accent colors for highlights and interactive elements.

