// src/components/ui/Badge.tsx
import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "gold" | "mono";
  className?: string;
  "aria-label"?: string;
};

export default function Badge({
  children,
  tone = "gold",
  className = "",
  ...rest
}: BadgeProps) {
  const gold =
    "bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/40 shadow-[0_0_0_1px_rgba(212,175,55,0.15)]";
  const mono =
    "bg-[#1A1A1A] text-white border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]";
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl text-xs tracking-wide";

  return (
    <span
      className={`${base} ${tone === "gold" ? gold : mono} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
