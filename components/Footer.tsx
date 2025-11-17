'use client'

import Link from 'next/link'

export default function Footer() {
  const socialLinks = [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
    { name: 'Email', icon: '📧', url: 'mailto:your.email@example.com' },
  ]

  return (
    <footer className="w-full py-8 border-t border-accent/20 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Your Name. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:scale-110 transition-transform hover:text-accent"
                aria-label={social.name}
                title={social.name}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

