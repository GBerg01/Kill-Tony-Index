"use client";

type GlobalSearchBarProps = {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
};

export const GlobalSearchBar = ({
  placeholder = "Search by contestant, episode, guest, or joke…",
  className = "",
  inputClassName = "",
}: GlobalSearchBarProps) => (
  <div
    className={`flex items-center gap-2 rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs text-kt-muted shadow-soft-glow ${className}`}
  >
    <span className="text-base">⌕</span>
    <input
      className={`w-full bg-transparent text-sm text-white placeholder:text-kt-muted focus:outline-none ${inputClassName}`}
      placeholder={placeholder}
      aria-label="Search"
    />
  </div>
);
