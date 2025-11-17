'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackgroundEffect from '@/components/BackgroundEffect'

export default function Resume() {
  return (
    <>
      <BackgroundEffect />
      <Navbar isHorizontal />
      
      <main className="min-h-screen flex flex-col pt-24">
        <div className="flex-1 max-w-5xl mx-auto px-6 py-20">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-8 text-text-primary">
              <span className="text-accent font-mono text-lg">Resume</span>
            </h1>
            
            <div className="bg-bg-secondary rounded-lg p-8 border border-accent/20 mb-8">
              <div className="aspect-[8.5/11] bg-white rounded">
                <iframe
                  src="/resume.pdf"
                  className="w-full h-full rounded"
                  title="Resume"
                />
                <p className="text-text-secondary text-sm mt-4 text-center">
                  If the PDF doesn't load,{' '}
                  <a href="/resume.pdf" download className="text-accent hover:text-accent-hover">
                    download it here
                  </a>
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <a
                href="/resume.pdf"
                download
                className="inline-block px-6 py-3 bg-accent text-bg-primary rounded hover:bg-accent-hover transition-all font-medium"
              >
                Download Resume PDF
              </a>
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </>
  )
}

