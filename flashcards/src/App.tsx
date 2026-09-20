import React, { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { type Deck } from './types/flashcard'

export default function App() {
  const [selectedYear, setSelectedYear] = useState('2026')

  const handleCreateDeck = async () => {
    try {
      const response = await invoke('create_deck', {
        payload: {
          title: 'CompTIA A+ 1201',
          image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
        }
      })
      console.log('Rust response:', response)
      alert(`Success: ${JSON.stringify(response)}`)
    } catch (error) {
      console.error('Rust error:', error)
    }
  }
  
  const decks: Deck[] = [
    {
      id: '1',
      title: 'CompTIA A+ Core 1',
      cardCount: 42,
      imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80',
    },
    {
      id: '2',
      title: 'Japanese Vocabulary (N5)',
      cardCount: 120,
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Outer Centered Container */}
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Top Header & Quick Action Bubbles */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-amber-400 tracking-tight">Flashcard Studio</h1>
            <p className="text-sm text-slate-400">Personal Study Dashboard</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleCreateDeck}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span> Create Deck
            </button>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-full border border-slate-700 transition-all cursor-pointer">
              ⚙ Settings
            </button>
          </div>
        </header>

        {/* Study Metrics Summary */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Study Time</span>
            <span className="text-2xl font-bold text-amber-400 mt-1">14.2 hrs</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col">
            <span className="text-xs text-slate-400 uppercase font-semibold">Current Streak</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1">12 Days 🔥</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col">
            <span className="text-xs text-slate-400 uppercase font-semibold">Proficient Cards</span>
            <span className="text-2xl font-bold text-sky-400 mt-1">318 Cards</span>
          </div>
        </section>

        {/* GitHub-Style Contribution Calendar */}
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-md font-semibold text-slate-200">Study Activity</h2>
            <div className="flex gap-1 text-xs">
              {['2025', '2026'].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedYear === year 
                      ? 'bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30' 
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Matrix Placeholder */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1.5 text-xs text-slate-500 mb-2 justify-between min-w-[500px]">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-1 min-w-[500px]">
              {Array.from({ length: 182 }).map((_, i) => {
                // Generates varying green intensity colors for demo
                const intensities = ['bg-slate-800', 'bg-emerald-950', 'bg-emerald-800', 'bg-emerald-600', 'bg-emerald-400'];
                const intensity = intensities[i % intensities.length];
                return (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-sm ${intensity} transition-all hover:scale-125 cursor-pointer`} 
                    title={`Day ${i + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Deck Grid Section */}
        <section className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <div 
                key={deck.id}
                className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-xl flex flex-col"
              >
                {/* Thumbnail Image */}
                <div className="h-36 w-full overflow-hidden bg-slate-800 relative">
                  <img 
                    src={deck.imageUrl} 
                    alt={deck.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  
                  {/* Hover Quick Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-1.5 bg-slate-900/80 hover:bg-slate-900 text-slate-200 rounded-md backdrop-blur-sm transition-colors"
                      title="Edit Deck"
                    >
                      ✏️
                    </button>
                    <button 
                      className="p-1.5 bg-slate-900/80 hover:bg-red-900/80 text-red-300 rounded-md backdrop-blur-sm transition-colors"
                      title="Delete Deck"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Deck Content Info */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                      {deck.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{deck.cardCount} cards</p>
                  </div>

                  <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-sm font-semibold rounded-lg transition-colors cursor-pointer">
                    Study Deck
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}