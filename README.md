# Personal Portfolio Website

A professional yet playful personal website showcasing my journey, projects, and skills. Built with pure HTML, CSS, and vanilla JavaScript.

## Features

- 🎨 **Dual Theme System**: Toggle between professional and pixel themes
- ✨ **Interactive Background**: Mouse-responsive ombre background with animated stars
- 🎮 **Mini Game**: Fun interactive game to showcase personality
- 📄 **Resume Integration**: Embedded resume viewer
- 📱 **Responsive Design**: Works beautifully on all devices
- 🎯 **Smooth Animations**: Subtle CSS animations throughout

## Pages

- **index.html**: Landing page with introduction and featured projects
- **about.html**: Personal story, experience, and education
- **projects.html**: Showcase of all projects with details
- **resume.html**: Embedded PDF resume viewer
- **contact.html**: Coffee chat scheduling and social media links
- **game.html**: Interactive mini-game

## Getting Started

### No Build Required!

This is a static website - just open the HTML files in your browser!

1. **Open the website:**
   - Simply open `index.html` in your web browser
   - Or use a local server (see below)

2. **Using a Local Server (Recommended):**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```
   Then visit `http://localhost:8000`

### Add Your Resume

Place your resume PDF file in the root directory as `resume.pdf`

## Customization

### Update Personal Information

1. **Home Page**: Edit `index.html` to update Allena Oglivie, bio, and featured projects
2. **About Page**: Edit `about.html` with your experience and education
3. **Projects**: Update `projects.html` with your actual projects
4. **Contact**: Update social media links in `contact.html` and footer sections
5. **Resume**: Place your resume PDF in the root folder as `resume.pdf`

### Theme Colors

Edit CSS variables in `css/styles.css` to customize colors for both themes:

```css
:root {
  --bg-primary: #0a192f;
  --bg-secondary: #112240;
  --text-primary: #ccd6f6;
  --text-secondary: #8892b0;
  --accent: #64ffda;
  --accent-hover: #52e0c4;
}
```

### Social Media Links

Update the social media links in:
- Footer sections of all HTML files
- `contact.html` social media cards

## File Structure

```
.
├── index.html          # Home page
├── about.html          # About page
├── contact.html        # Contact page
├── projects.html       # Projects page
├── resume.html         # Resume page
├── game.html           # Mini game page
├── css/
│   ├── styles.css      # Main styles
│   └── animations.css  # Animation styles
├── js/
│   ├── theme.js        # Theme toggle functionality
│   ├── background.js   # Background effects
│   ├── nav.js          # Navigation management
│   └── game.js         # Mini game logic
├── public/             # Static assets
│   └── resume.pdf      # Your resume (add this)
└── README.md
```

## Deployment

This static site can be deployed to:
- **GitHub Pages**: Just push to your repository and enable Pages
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- **Any static hosting service**

## Technologies

- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript (ES6+)
- No frameworks or build tools required!

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
