import { useRef } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asLink?: boolean;
};

export default function MagneticButton({
  asLink,
  className = "",
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      }}
      onMouseLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = `translate(0,0)`;
      }}
      className={`relative inline-flex items-center justify-center rounded-2xl px-5 h-12 font-medium transition-all
      bg-[#D4AF37] text-black shadow-[0_8px_30px_rgba(212,175,55,.25)]
      hover:brightness-110 active:scale-[.98] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]
      ${className}`}
      {...rest}
    />
  );
}
