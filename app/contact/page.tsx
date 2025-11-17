'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackgroundEffect from '@/components/BackgroundEffect'
import Link from 'next/link'

export default function Contact() {
  const socialLinks = [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com', description: 'Check out my code' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com', description: 'Connect professionally' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com', description: 'Follow my thoughts' },
    { name: 'Email', icon: '📧', url: 'mailto:your.email@example.com', description: 'Send me a message' },
  ]

  return (
    <>
      <BackgroundEffect />
      <Navbar isHorizontal />
      
      <main className="min-h-screen flex flex-col pt-24">
        <div className="flex-1 max-w-4xl mx-auto px-6 py-20">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 text-text-primary">
              <span className="text-accent font-mono text-lg">Contact</span>
            </h1>
            
            <p className="text-text-secondary text-lg mb-12 max-w-2xl">
              I'm always open to discussing new projects, creative ideas, or opportunities 
              to be part of your visions. Feel free to reach out!
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-bg-secondary rounded-lg p-8 border border-accent/20 hover:border-accent/40 transition-all">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">Coffee Chat ☕</h2>
                <p className="text-text-secondary mb-6">
                  Let's grab a virtual coffee and chat about anything - from tech to life!
                </p>
                <Link
                  href="https://calendly.com/your-username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-accent text-bg-primary rounded hover:bg-accent-hover transition-all font-medium"
                >
                  Schedule a Chat
                </Link>
              </div>
              
              <div className="bg-bg-secondary rounded-lg p-8 border border-accent/20 hover:border-accent/40 transition-all">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">Email Me 📧</h2>
                <p className="text-text-secondary mb-6">
                  Prefer email? Drop me a line and I'll get back to you as soon as possible.
                </p>
                <Link
                  href="mailto:your.email@example.com"
                  className="inline-block px-6 py-3 border-2 border-accent text-accent rounded hover:bg-accent/10 transition-all font-medium"
                >
                  Send Email
                </Link>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 text-text-primary">Connect on Social Media</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-bg-secondary rounded-lg p-6 border border-accent/20 hover:border-accent/40 transition-all text-center group"
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                      {social.icon}
                    </div>
                    <h3 className="font-bold text-text-primary mb-1">{social.name}</h3>
                    <p className="text-text-secondary text-sm">{social.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </>
  )
}

