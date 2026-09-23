import React from 'react'

const Metrics = () => {
  return (
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
  )
}

export default Metrics