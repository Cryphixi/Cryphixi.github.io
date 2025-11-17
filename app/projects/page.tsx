'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackgroundEffect from '@/components/BackgroundEffect'

export default function Projects() {
  const projects = [
    {
      title: 'Project Name 1',
      description: 'A comprehensive description of your project, what it does, and the problems it solves.',
      tech: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      github: 'https://github.com',
      live: 'https://example.com',
      featured: true,
    },
    {
      title: 'Project Name 2',
      description: 'Another project description highlighting your skills and achievements.',
      tech: ['Python', 'Flask', 'PostgreSQL'],
      github: 'https://github.com',
      live: 'https://example.com',
      featured: true,
    },
    {
      title: 'Project Name 3',
      description: 'A third project showcasing different technologies and approaches.',
      tech: ['Node.js', 'Express', 'MongoDB'],
      github: 'https://github.com',
      live: 'https://example.com',
      featured: false,
    },
  ]

  return (
    <>
      <BackgroundEffect />
      <Navbar isHorizontal />
      
      <main className="min-h-screen flex flex-col pt-24">
        <div className="flex-1 max-w-6xl mx-auto px-6 py-20">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 text-text-primary">
              <span className="text-accent font-mono text-lg">Projects</span>
            </h1>
            
            <p className="text-text-secondary text-lg mb-12 max-w-2xl">
              Here are some of the projects I've worked on. Each one represents a unique 
              challenge and learning experience.
            </p>
            
            <div className="space-y-12">
              {projects.map((project, i) => (
                <div
                  key={i}
                  className={`grid md:grid-cols-2 gap-8 items-center ${
                    i % 2 === 1 ? 'md:grid-flow-dense' : ''
                  }`}
                >
                  <div className={`bg-bg-secondary rounded-lg p-8 border border-accent/20 hover:border-accent/40 transition-all ${i % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-accent text-sm font-mono">
                        Featured Project
                      </span>
                      <div className="flex gap-4">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-secondary hover:text-accent transition-colors"
                          aria-label="GitHub"
                        >
                          📦
                        </a>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-secondary hover:text-accent transition-colors"
                          aria-label="Live Site"
                        >
                          🔗
                        </a>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-text-primary">
                      {project.title}
                    </h3>
                    <p className="text-text-secondary mb-6">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="text-xs text-accent font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`relative group ${i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                    <div className="absolute inset-0 border-2 border-accent rounded-lg translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
                    <div className="relative bg-bg-secondary rounded-lg p-8 h-64 flex items-center justify-center border border-accent/20">
                      <span className="text-6xl">🚀</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </>
  )
}

