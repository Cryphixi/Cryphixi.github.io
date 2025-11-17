'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackgroundEffect from '@/components/BackgroundEffect'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <BackgroundEffect />
      <Navbar />
      
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center pl-24 pr-6 py-20">
          <div className="max-w-4xl w-full animate-fade-in">
            <div className="mb-6">
              <p className="text-accent font-mono text-sm mb-4 animate-slide-in">
                Hi, my name is
              </p>
              <h1 className="text-6xl md:text-7xl font-bold mb-4 text-text-primary animate-slide-in" style={{ animationDelay: '0.1s' }}>
                Your Name.
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold text-text-secondary mb-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                I build things for the web.
              </h2>
            </div>
            
            <p className="text-text-secondary text-lg max-w-2xl mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              I'm a software engineer specializing in building exceptional digital experiences. 
              Currently, I'm focused on building accessible, human-centered products.
            </p>
            
            <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/projects"
                className="px-6 py-3 border-2 border-accent text-accent rounded hover:bg-accent/10 transition-all hover:scale-105"
              >
                Check out my work!
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-accent text-bg-primary rounded hover:bg-accent-hover transition-all hover:scale-105 font-medium"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>

        <div className="pl-24 pr-6 pb-20">
          <div className="max-w-4xl">
            <h3 className="text-2xl font-bold mb-8 text-text-primary">
              <span className="text-accent font-mono text-lg">01.</span> About Me
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-text-secondary">
                <p className="mb-4">
                  Hello! I'm a software engineer based in [Your Location], specializing in building 
                  exceptional digital experiences. I enjoy creating things that live on the internet, 
                  whether that be websites, applications, or anything in between.
                </p>
                <p className="mb-4">
                  My goal is to always build products that provide pixel-perfect, performant experiences.
                </p>
                <p>
                  Here are a few technologies I've been working with recently:
                </p>
                <ul className="grid grid-cols-2 gap-2 mt-4 list-disc list-inside text-accent">
                  <li className="text-text-secondary"><span className="text-accent">▹</span> JavaScript (ES6+)</li>
                  <li className="text-text-secondary"><span className="text-accent">▹</span> React</li>
                  <li className="text-text-secondary"><span className="text-accent">▹</span> TypeScript</li>
                  <li className="text-text-secondary"><span className="text-accent">▹</span> Node.js</li>
                  <li className="text-text-secondary"><span className="text-accent">▹</span> Next.js</li>
                  <li className="text-text-secondary"><span className="text-accent">▹</span> Python</li>
                </ul>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 border-2 border-accent rounded-lg translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
                <div className="relative bg-bg-secondary rounded-lg p-4 h-64 flex items-center justify-center">
                  <span className="text-6xl">👨‍💻</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pl-24 pr-6 pb-20">
          <div className="max-w-4xl">
            <h3 className="text-2xl font-bold mb-8 text-text-primary">
              <span className="text-accent font-mono text-lg">02.</span> Featured Projects
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-bg-secondary rounded-lg p-6 hover:transform hover:scale-105 transition-all border border-accent/20 hover:border-accent/40"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">📁</span>
                    <div className="flex gap-2">
                      <a href="#" className="text-accent hover:text-accent-hover">🔗</a>
                      <a href="#" className="text-accent hover:text-accent-hover">📦</a>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-text-primary">Project Name {i}</h4>
                  <p className="text-text-secondary text-sm mb-4">
                    A brief description of what this project does and the technologies used.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Next.js'].map((tech) => (
                      <span key={tech} className="text-xs text-accent font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/projects"
                className="text-accent hover:text-accent-hover font-medium"
              >
                View All Projects →
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}

