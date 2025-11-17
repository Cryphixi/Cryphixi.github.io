# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Add Your Resume**
   - Place your resume PDF file in the `public` folder
   - Name it `resume.pdf`

3. **Customize Your Information**
   - Update your name, bio, and links throughout the pages
   - Update social media links in `components/Footer.tsx` and `app/contact/page.tsx`
   - Add your actual projects to `app/projects/page.tsx`
   - Update experience and education in `app/about/page.tsx`

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Customization Checklist

- [ ] Update name and bio on home page (`app/page.tsx`)
- [ ] Add your resume PDF to `public/resume.pdf`
- [ ] Update social media links in Footer and Contact page
- [ ] Add your actual projects
- [ ] Update experience and education in About page
- [ ] Update email addresses
- [ ] Add coffee chat link (Calendly or similar)
- [ ] Customize theme colors if desired (`app/globals.css`)

## Notes

- The TypeScript linting errors you might see before installing dependencies are normal and will resolve after running `npm install`
- Make sure to update all placeholder URLs and email addresses
- The theme toggle persists in localStorage
- All pages are responsive and work on mobile devices

