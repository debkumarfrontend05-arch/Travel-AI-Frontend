  import React from "react";
import { ChevronDown } from "lucide-react";

const BookingsOverview = () => {
  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-900">Bookings Overview</h3>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
        >
          This Month
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="relative mt-5 h-[210px] rounded-xl bg-slate-50/60 p-4">
        <svg viewBox="0 0 520 260" className="h-full w-full">
          <line x1="40" y1="20" x2="500" y2="20" stroke="#e2e8f0" />
          <line x1="40" y1="70" x2="500" y2="70" stroke="#e2e8f0" />
          <line x1="40" y1="120" x2="500" y2="120" stroke="#e2e8f0" />
          <line x1="40" y1="170" x2="500" y2="170" stroke="#e2e8f0" />
          <line x1="40" y1="220" x2="500" y2="220" stroke="#e2e8f0" />

          <line x1="270" y1="20" x2="270" y2="220" stroke="#d1d5db" strokeDasharray="4 4" />

          <path
            d="M40 165 C 90 170, 95 80, 140 95 C 170 105, 195 70, 225 60 C 245 52, 260 42, 270 55 C 305 90, 330 120, 365 100 C 390 85, 410 45, 440 65 C 465 83, 480 60, 500 48"
            fill="none"
            stroke="#6557ff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="270" cy="55" r="7" fill="#6557ff" />

          <text x="8" y="24" fontSize="12" fill="#64748b">200</text>
          <text x="12" y="74" fontSize="12" fill="#64748b">150</text>
          <text x="12" y="124" fontSize="12" fill="#64748b">100</text>
          <text x="18" y="174" fontSize="12" fill="#64748b">50</text>
          <text x="22" y="224" fontSize="12" fill="#64748b">0</text>

          <text x="40" y="248" fontSize="12" fill="#475569">1 May</text>
          <text x="140" y="248" fontSize="12" fill="#475569">8 May</text>
          <text x="248" y="248" fontSize="12" fill="#475569">15 May</text>
          <text x="350" y="248" fontSize="12" fill="#475569">22 May</text>
          <text x="465" y="248" fontSize="12" fill="#475569">31 May</text>
        </svg>

        <div className="absolute left-1/2 top-[52px] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2 text-center text-white shadow-lg">
          <p className="text-sm font-semibold leading-5">154 Bookings</p>
          <p className="text-xs text-slate-300">15 May</p>
        </div>
      </div>
    </section>
  );
};

export default BookingsOverview;