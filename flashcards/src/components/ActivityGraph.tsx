import React, { useState } from 'react'

const ActivityGraph = () => {
    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1
    const [selectedYear, setSelectedYear] = useState(currentYear)

  return (
    <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-4">
        <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold text-slate-200">Study Activity</h2>
        <div className="flex gap-1 text-xs">
            {[lastYear, currentYear].map((year) => (
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
  )
}

export default ActivityGraph