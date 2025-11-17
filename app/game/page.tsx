'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackgroundEffect from '@/components/BackgroundEffect'
import { useState, useEffect, useRef } from 'react'

export default function Game() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number }>>([])
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying])

  const startGame = () => {
    setScore(0)
    setTime(0)
    setIsPlaying(true)
    setTargets([])
  }

  const stopGame = () => {
    setIsPlaying(false)
    setTargets([])
  }

  useEffect(() => {
    if (!isPlaying) return

    const spawnTarget = () => {
      if (!gameAreaRef.current) return
      
      const newTarget = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // 10-90%
        y: Math.random() * 80 + 10,
      }
      
      setTargets(prev => [...prev, newTarget])
      
      setTimeout(() => {
        setTargets(prev => prev.filter(t => t.id !== newTarget.id))
      }, 2000)
    }

    const spawnInterval = setInterval(() => {
      spawnTarget()
    }, 1500)
    
    return () => clearInterval(spawnInterval)
  }, [isPlaying])

  const handleTargetClick = (id: number) => {
    setScore(prev => prev + 10)
    setTargets(prev => prev.filter(t => t.id !== id))
  }

  return (
    <>
      <BackgroundEffect />
      <Navbar isHorizontal />
      
      <main className="min-h-screen flex flex-col pt-24">
        <div className="flex-1 max-w-4xl mx-auto px-6 py-20">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 text-text-primary">
              <span className="text-accent font-mono text-lg">Mini Game</span>
            </h1>
            
            <p className="text-text-secondary text-lg mb-8">
              Click on the targets as they appear! See how many points you can score.
            </p>
            
            <div className="bg-bg-secondary rounded-lg p-8 border border-accent/20 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div className="text-center">
                  <p className="text-text-secondary text-sm mb-1">Score</p>
                  <p className="text-3xl font-bold text-accent">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary text-sm mb-1">Time</p>
                  <p className="text-3xl font-bold text-accent">{time}s</p>
                </div>
                <div>
                  {!isPlaying ? (
                    <button
                      onClick={startGame}
                      className="px-6 py-3 bg-accent text-bg-primary rounded hover:bg-accent-hover transition-all font-medium"
                    >
                      Start Game
                    </button>
                  ) : (
                    <button
                      onClick={stopGame}
                      className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-all font-medium"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>
              
              <div
                ref={gameAreaRef}
                className="relative bg-bg-primary rounded-lg border-2 border-accent/30 h-96 overflow-hidden"
              >
                {targets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => handleTargetClick(target.id)}
                    className="absolute w-12 h-12 bg-accent rounded-full hover:scale-110 transition-transform animate-float"
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    aria-label="Target"
                  >
                    <span className="text-2xl">⭐</span>
                  </button>
                ))}
                
                {!isPlaying && targets.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-text-secondary text-xl">Click "Start Game" to begin!</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-bg-secondary rounded-lg p-6 border border-accent/20">
              <h2 className="text-xl font-bold mb-4 text-text-primary">How to Play</h2>
              <ul className="space-y-2 text-text-secondary">
                <li>• Click "Start Game" to begin</li>
                <li>• Click on the stars as they appear</li>
                <li>• Each star is worth 10 points</li>
                <li>• Stars disappear after 2 seconds</li>
                <li>• Try to get the highest score!</li>
              </ul>
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </>
  )
}

