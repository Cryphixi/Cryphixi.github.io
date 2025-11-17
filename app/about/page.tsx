'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackgroundEffect from '@/components/BackgroundEffect'

export default function About() {
  return (
    <>
      <BackgroundEffect />
      <Navbar isHorizontal />
      
      <main className="min-h-screen flex flex-col pt-24">
        <div className="flex-1 max-w-4xl mx-auto px-6 py-20">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 text-text-primary">
              <span className="text-accent font-mono text-lg">About</span>
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-text-secondary text-lg mb-6">
                Hello! I'm a software engineer passionate about creating beautiful, functional, 
                and user-centered digital experiences. I've always been drawn to the intersection 
                of design and development, and I love bringing ideas to life through code.
              </p>
              
              <p className="text-text-secondary text-lg mb-6">
                My journey in software development started [your story here]. Since then, I've had 
                the privilege of working at various companies, contributing to projects that have 
                impacted thousands of users.
              </p>
              
              <h2 className="text-3xl font-bold mt-12 mb-6 text-text-primary">
                Experience
              </h2>
              
              <div className="space-y-8">
                {[
                  {
                    title: 'Software Engineer',
                    company: 'Company Name',
                    period: '2023 - Present',
                    description: 'Description of your role and achievements.',
                  },
                  {
                    title: 'Software Engineer Intern',
                    company: 'Company Name',
                    period: '2022 - 2023',
                    description: 'Description of your role and achievements.',
                  },
                ].map((exp, i) => (
                  <div key={i} className="border-l-2 border-accent pl-6">
                    <h3 className="text-xl font-bold text-text-primary">{exp.title}</h3>
                    <p className="text-accent font-medium">{exp.company}</p>
                    <p className="text-text-secondary text-sm mb-2">{exp.period}</p>
                    <p className="text-text-secondary">{exp.description}</p>
                  </div>
                ))}
              </div>
              
              <h2 className="text-3xl font-bold mt-12 mb-6 text-text-primary">
                Education
              </h2>
              
              <div className="space-y-4">
                <div className="border-l-2 border-accent pl-6">
                  <h3 className="text-xl font-bold text-text-primary">Degree Name</h3>
                  <p className="text-accent font-medium">University Name</p>
                  <p className="text-text-secondary text-sm">Year - Year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </>
  )
}

