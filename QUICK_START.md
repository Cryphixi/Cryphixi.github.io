# Quick Start Guide

## 🚀 Getting Started (No Installation Needed!)

Your website is now pure HTML/CSS/JavaScript - no build step required!

### Option 1: Open Directly
1. Simply double-click `index.html` to open it in your browser
2. That's it! The website works immediately

### Option 2: Use a Local Server (Recommended)
For better functionality (especially for the resume PDF), use a local server:

**Python:**
```bash
python -m http.server 8000
```
Then visit: http://localhost:8000

**Node.js:**
```bash
npx http-server
```

## 📝 What to Customize

1. **Allena Oglivie**: Search and replace "Allena Oglivie" in all HTML files
2. **Resume**: Place your `resume.pdf` file in the root directory
3. **Social Links**: Update links in:
   - Footer of all pages
   - Contact page social cards
4. **Projects**: Edit `projects.html` with your actual projects
5. **About**: Update `about.html` with your experience
6. **Email**: Replace `your.email@example.com` everywhere
7. **Coffee Chat**: Update the Calendly link in `contact.html`

## 🎨 Files Structure

- `index.html` - Home page
- `about.html` - About page  
- `contact.html` - Contact page
- `projects.html` - Projects page
- `resume.html` - Resume page
- `game.html` - Mini game
- `css/` - All your styles
- `js/` - All JavaScript functionality

## ✨ Features Working

- ✅ Theme toggle (professional/pixel)
- ✅ Mouse-responsive background with stars
- ✅ Mini game
- ✅ All navigation
- ✅ Responsive design
- ✅ Smooth animations

## 🐛 Troubleshooting

**Resume PDF not showing?**
- Make sure `resume.pdf` is in the root directory (same folder as index.html)
- Use a local server instead of opening directly

**Theme not saving?**
- Check that JavaScript is enabled in your browser
- The theme is saved in localStorage

**Animations not working?**
- Make sure all CSS files are loading
- Check browser console for errors

That's it! Your website is ready to customize! 🎉

