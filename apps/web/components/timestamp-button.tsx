type TimestampButtonProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export const TimestampButton = ({ href, label, variant = "primary" }: TimestampButtonProps) => {
  const baseStyles =
    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition";
  const variantStyles =
    variant === "primary"
      ? "border-kt-accent/60 bg-kt-accent/20 text-white hover:border-kt-accent"
      : "border-kt-border bg-kt-card text-white hover:border-white/40";

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${baseStyles} ${variantStyles}`}>
      <span>{label}</span>
      <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">
        YouTube ↗
      </span>
    </a>
  );
};
