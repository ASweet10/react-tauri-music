import { useMemo } from 'react'

interface ActivityMatrixProps {
  activityData?: Record<string, number>;
}

export function ActivityMatrix({ activityData = {} }: ActivityMatrixProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date(); // Sept 23, 2026
    const todayDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon ... 3 = Wed

    // Build 53 full weeks ending on current day of week
    const days: { dateStr: string; count: number; isFuture: boolean }[] = [];
    const totalDays = 52 * 7 + (todayDayOfWeek + 1);

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      days.push({
        dateStr,
        count: activityData[dateStr] || 0,
        isFuture: d > today,
      });
    }

    // Chunk into 53 week columns
    const weekCols: (typeof days)[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekCols.push(days.slice(i, i + 7));
    }

    // Map Month Labels to exact Column Indexes
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels: { name: string; colIdx: number }[] = [];
    let lastMonth = -1;

    weekCols.forEach((week, colIdx) => {
      const validDay = week.find((d) => !d.isFuture);
      if (validDay) {
        const month = new Date(validDay.dateStr).getMonth();
        // Prevent labeling the very last column if it clips off edge
        if (month !== lastMonth && colIdx < weekCols.length - 2) {
          labels.push({ name: months[month], colIdx });
          lastMonth = month;
        }
      }
    });

    return { weeks: weekCols, monthLabels: labels };
  }, [activityData]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full overflow-x-auto">
      <div className="min-w-[680px] flex flex-col gap-2">
        
        {/* ROW 1: MONTH LABELS TRACK */}
        {/* items-end guarantees all month spans align horizontally to the bottom of the row */}
        <div className="grid grid-cols-53 gap-0.75 h-5 items-end">
          {monthLabels.map((m, idx) => (
            <span
              key={idx}
              style={{ gridColumnStart: m.colIdx + 1 }}
              className="col-span-4 text-[10px] font-medium text-slate-400 leading-none select-none"
            >
              {m.name}
            </span>
          ))}
        </div>

        {/* ROW 2: 53-COLUMN MATRIX GRID */}
        <div className="grid grid-cols-53 gap-0.75">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-0.75">
              {week.map((day, dIdx) => {
                // Future days in current week rendered invisible to leave clean right edge
                if (day.isFuture) {
                  return <div key={dIdx} className="w-2.5 h-2.5 opacity-0 pointer-events-none" />;
                }

                return (
                  <div
                    key={day.dateStr}
                    className={`w-2.5 h-2.5 rounded-xs transition-all hover:scale-125 cursor-pointer ${
                      day.count === 0 ? 'bg-slate-800/60' :
                      day.count <= 5 ? 'bg-emerald-950 border border-emerald-800/40' :
                      day.count <= 15 ? 'bg-emerald-800' :
                      day.count <= 30 ? 'bg-emerald-600' : 'bg-emerald-400'
                    }`}
                    title={`${day.dateStr}: ${day.count} cards reviewed`}
                  />
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}