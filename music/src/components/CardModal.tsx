import { useState } from 'react'
import { type Card } from '../types/flashcard'
import { pickImageFromDisk } from '../utils/utils'
import coolCat from '../assets/coolcat.jpg'

interface CardModalProps {
    onClose: () => void
    onCardCreated: (updatedCards: Card[]) => void
    cards: Card[]
}

export default function CardModal ({ onClose, onCardCreated, cards }: CardModalProps) {
    const [cardQuestion, setCardQuestion] = useState('')
    const [cardAnswer, setCardAnswer] = useState('')
    const [cardImageUrl, setCardImageUrl] = useState('')

    const handleSaveCard = () => {

        const newCard: Card = {
            id: `card_${Date.now()}`,
            question: cardQuestion,
            answer: cardAnswer,
            imageUrl: cardImageUrl || coolCat,
        }

        const updatedCards = [...cards, newCard]

        // Pass cards to deck modal
        onCardCreated(updatedCards)

        // Close modal
        onClose()
    }

    const pickCardImage = () => {
        pickImageFromDisk(setCardImageUrl)
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* LEFT COLUMN: Input Fields */}
        <div className="w-full md:w-5/12 p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 overflow-y-auto">
          
          <h3 className="text-lg font-bold text-slate-100">Add New Card</h3>
            
          <div className="flex flex-col gap-3 mt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Question (Front Content)</label>
              <textarea rows={3} value={cardQuestion} onChange={(e) => setCardQuestion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Answer</label>
              <textarea rows={3} value={cardAnswer} onChange={(e) => setCardAnswer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Front Image</label>
              <button type="button" onClick={pickCardImage}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Choose file...
              </button>
            </div>
          </div>

          <div className="mt-auto pt-4 flex justify-end gap-2 border-t border-slate-800/80">
            <button onClick={onClose} 
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveCard} 
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-lg shadow-amber-500/10"
            >
              Add Card
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Preview Canvas (~65% width) */}
        <div className="w-full md:w-7/12 bg-slate-950 p-6 flex flex-col justify-between items-center relative overflow-y-auto min-h-[350px]">
          
          {/* PREVIEW CONTAINER */}
          <div className="w-full flex-1 flex items-center justify-center my-auto py-4">

              <div className="w-full max-w-sm flex flex-col gap-4">
                {/* Front Side */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md relative min-h-[200px] flex flex-col">
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">FRONT</span>
                  
                  <div className='flex flex-row pt-6 justify-between gap-4'>
                    <p className="w-2/3 text-sm text-slate-100 font-medium scrollbar-none">
                        {cardQuestion}
                    </p>
                    
                    {cardImageUrl && (
                        <img src={cardImageUrl} alt="Card visual" className="w-1/3 max-h-32 object-contain rounded border border-slate-800" />
                    )}
                  </div>

                </div>

                {/* Back Side */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 shadow-md relative min-h-[200px] flex flex-col justify-between">
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">BACK</span>
                  <div className='flex w-full pt-6'>
                    <p className="w-full text-sm text-slate-100 font-medium scrollbar-none">
                        {cardAnswer}
                    </p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    )
}