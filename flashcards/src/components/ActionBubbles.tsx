import React from 'react'

interface ActionBubblesProps {
    onClose: () => void
}

const ActionBubbles = ({ onClose }: ActionBubblesProps) => {

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
            <h1 className="text-3xl font-extrabold text-amber-800 tracking-tight">Flashcard Studio</h1>
        </div>

        <div className="flex flex-wrap gap-2">
        <button onClick={onClose}
            className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-slate-950 text-sm font-semibold rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
            <span>+</span> Create Deck
        </button>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-full border border-slate-700 transition-all cursor-pointer">
            ⚙ Settings
        </button>
        </div>
    </header>
  )
}

export default ActionBubbles