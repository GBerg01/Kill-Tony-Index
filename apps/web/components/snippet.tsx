"use client";

import { useState } from "react";

export const Snippet = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2 text-sm text-kt-muted">
      <p className={expanded ? "" : "snippet-clamp"}>{text}</p>
      <button
        className="text-xs font-semibold text-white/80 transition hover:text-white"
        onClick={() => setExpanded((prev) => !prev)}
        type="button"
      >
        {expanded ? "Collapse" : "Expand"}
      </button>
    </div>
  );
};
