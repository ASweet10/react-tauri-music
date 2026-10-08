import { useState } from 'react'
import { type Card, type Deck } from '../types/flashcard'
import { invoke } from '@tauri-apps/api/core'
import CreateCardModal from './CardModal'
import { pickImageFromDisk } from '../utils/utils'
import coolCat from '../assets/coolcat.jpg'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

interface DeckModalProps {
    onClose: () => void
    onDeckCreated: (updatedDecks: Deck[]) => void
}

export default function DeckModal({ onClose, onDeckCreated }: DeckModalProps) {
    // Deck state
    const [deckTitle, setDeckTitle] = useState('')
    const [deckImageUrl, setDeckImageUrl] = useState('')
    const [cards, setCards] = useState<Card[]>([])
    const [cardModalOpen, setCardModalOpen] = useState(false)

    const handleSaveDeck = async () => {
        if (!deckTitle.trim()) return;
        try {
            console.log(deckImageUrl)
            // Call Rust to create deck
            const updatedDecks = await invoke<Deck[]>('create_deck', {
                payload: {
                    title: deckTitle,
                    image_url: deckImageUrl,
                    cards: cards,
                }
            })

            // Pass decks to app.tsx
            onDeckCreated(updatedDecks)

            // Close modal
            onClose()
        } catch(error) {
            console.error('Error saving deck:', error)
        }
    }

    const handlePickDeckImage = () => {
        pickImageFromDisk(setDeckImageUrl)
    }

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
                    <h3 className="text-xl font-bold text-slate-100">Create Deck</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-100 text-lg cursor-pointer">
                        ✕
                    </button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                    {/* Metadata & Controls */}
                    <div className="w-full md:w-1/4 bg-slate-950 p-5 border-r border-slate-800 flex flex-col gap-5 overflow-y-auto">

                        <div>
                            <label className="block font-bold text-slate-400 mb-1">Title</label>
                            <Input inputValue={deckTitle} onChange={(e) => setDeckTitle(e.target.value)} />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-400 mb-1">Cover Image</label>
                            <div className="flex flex-col gap-2">
                                {deckImageUrl && (
                                    <img src={deckImageUrl} alt="Deck Cover Preview" className="h-28 w-full object-cover rounded-lg border border-slate-800" />
                                )}
                                <button type="button" onClick={handlePickDeckImage}
                                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                                >
                                    Choose file...
                                </button>
                            </div>
                        </div>

                        <hr className="border-slate-800 my-2" />

                        <button
                            type="button"
                            onClick={() => setCardModalOpen(true)}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg shadow-md transition-all cursor-pointer"
                        >
                            + Add New Card
                        </button>
                        <Button >
                            + Add New Card
                        </Button>
                    </div>

                {/* Card Gallery */}
                <div className="flex-1 p-6 bg-slate-900/50 flex flex-col gap-4 overflow-y-auto">
                    <h4 className="font-bold text-slate-300">Cards</h4>

                    {cards.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl p-8">
                        <p className="text-sm">No cards in this deck yet.</p>
                        <p className="text-xs mt-1">Click "+ Add New Card" on the left panel to begin.</p>
                    </div>
                    ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {cards.map((card, idx) => (
                        <div key={card.id} onClick={() => setCardModalOpen(true)} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col cursor-pointer">
                            <img src={card.imageUrl || coolCat} alt={card.id} className="h-28 w-full object-cover bg-slate-900" />
                            <div className="p-3">
                                <p className="text-xs font-medium text-slate-200 mt-0.5 line-clamp-2">{card.question.slice(0, 30)}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-slate-950 border-t border-slate-800">
                <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg cursor-pointer">
                    Cancel
                </button>
                <button onClick={handleSaveDeck} className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg cursor-pointer">
                    Save Deck
                </button>
                </div>

            </div>

            {/* Add Card Modal */}
            {cardModalOpen && (
                <CreateCardModal onClose={() => setCardModalOpen(false)} onCardCreated={(updatedCards) => setCards(updatedCards)} cards={cards}/>
            )}
            </div>
      )
    }