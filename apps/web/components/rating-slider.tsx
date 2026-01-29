"use client";

import { useState } from "react";

export const RatingStarsOrSlider = () => {
  const [value, setValue] = useState(8);

  return (
    <div className="rounded-2xl border border-kt-border bg-kt-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-kt-muted">Rate this set</p>
          <p className="text-lg font-semibold text-white">Your score: {value}</p>
        </div>
        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80">
          1–10
        </span>
      </div>
      <input
        className="mt-4 w-full accent-orange-400"
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
      />
    </div>
  );
};
