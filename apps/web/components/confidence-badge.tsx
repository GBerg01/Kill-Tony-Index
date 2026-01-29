import type { ConfidenceLevel } from "@/lib/kt-index-data";

const styles: Record<ConfidenceLevel, string> = {
  High: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  Medium: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  Low: "border-rose-400/40 bg-rose-400/10 text-rose-200",
};

export const ConfidenceBadge = ({ level }: { level: ConfidenceLevel }) => (
  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[level]}`}>
    Confidence: {level}
  </span>
);
