import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { type Deck } from './types/flashcard'
import Metrics from './components/Metrics'
import ActivityGraph from './components/ActivityGraph'
import ActionBubbles from './components/ActionBubbles'
import DeckModal from './components/CreateDeckModal'


export default function App() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [deckModalOpen, setDeckModalOpen] = useState(false)

  const fetchDecks = async() => {
    try {
      const loadedDecks = await invoke<Deck[]>('get_decks')
      setDecks(loadedDecks)
    } catch(error) {
      console.error('deck loading from rust failed:', error)
    }
  }

  useEffect(() => {
    fetchDecks()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Outer Centered Container */}
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <ActionBubbles onClose={() => setDeckModalOpen(true)} />
        <Metrics />
        <ActivityGraph />

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
                  </div>

                  <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-sm font-semibold rounded-lg transition-colors cursor-pointer">
                    Study Deck
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {deckModalOpen && (
          <DeckModal 
            onClose={() => setDeckModalOpen(false)}
            onDeckCreated={(updatedDecks) => setDecks(updatedDecks)}
          />
        )}
      </div>

      <h4 className='text-xs'>Cool cat - <a href="https://unsplash.com/@raouldroog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Raoul Droog</a> on <a href="https://unsplash.com/photos/russian-blue-cat-wearing-yellow-sunglasses-yMSecCHsIBc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></h4>
    </div>
  )
}