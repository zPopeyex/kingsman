import { formatCOP } from "@/lib/money";
import React from "react";

type Props = {
  servicePrice: number; // precio del servicio seleccionado
  amount: number;
  setAmount: (v: number) => void;
  userEditedAmount: boolean;
  setUserEditedAmount: (v: boolean) => void;
};

const MIN = 10_000;
const STEP = 5_000;

const roundToStep = (n: number) => Math.round(n / STEP) * STEP;
const unique = <T,>(arr: T[]) => Array.from(new Set(arr));
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(v, hi));

export default function PaymentBoxWompi(props: Props) {
  const { servicePrice, amount, setAmount, setUserEditedAmount } = props;

  // ❶ Sugeridos derivados (no state)
  const suggestions = React.useMemo(() => {
    const half = Math.max(MIN, roundToStep((servicePrice || 0) / 2));
    const top = Math.max(MIN, roundToStep(servicePrice || 0));
    return unique([MIN, half, top])
      .filter((v) => v >= MIN && v <= Math.max(MIN, servicePrice || MIN))
      .sort((a, b) => a - b);
  }, [servicePrice]);

  // ❷ Reset al cambiar de servicio (sin acumular)
  React.useEffect(() => {
    if (!servicePrice) return;
    setAmount(Math.max(MIN, servicePrice));
    setUserEditedAmount(false);
  }, [servicePrice, setAmount, setUserEditedAmount]);

  const onPick = (value: number) => {
    setAmount(value);
    setUserEditedAmount(true);
  };

  const onChangeAmount: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = Number(e.target.value.replace(/\D/g, "")) || 0;
    const capped = clamp(
      roundToStep(raw),
      MIN,
      Math.max(MIN, servicePrice || MIN)
    );
    setAmount(capped);
    setUserEditedAmount(true);
  };

  const fmt = (v: number) =>
    v.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  return (
    <div>
      {/* Input existente (no se tocan estilos) */}
      <div className="mt-3">
        <input
          inputMode="numeric"
          value={amount ? amount.toString() : ""}
          onChange={onChangeAmount}
          className="w-full bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-xl px-4 py-2 text-white"
          placeholder={fmt(Math.max(MIN, servicePrice || MIN))}
          aria-label="Monto a pagar"
        />
        <p className="text-xs text-[#C7C7C7] mb-2 pt-2">Montos sugeridos:</p>
      </div>

      {/* Botones sugeridos (3 fijos, no acumulables) */}

      <div className="grid grid-cols-3 gap-3 mt-3 p-3 ">
        {suggestions.map((v) => (
          <button
            key={`sugg-${servicePrice}-${v}`}
            type="button"
            onClick={() => onPick(v)}
            className="rounded-xl border border-[#D4AF37]/40 px-4 py-2 hover:bg-[#D4AF37]/10"
            aria-label={`Pagar ${fmt(v)}`}
          >
            {fmt(v)}
          </button>
        ))}
      </div>
      <div className="flex items-start gap-3 p-3 bg-[#D4AF37]/10 rounded-xl">
        <svg
          className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-sm text-[#C7C7C7] space-y-1">
          <p className="mt-1 text-xs text-[#C7C7C7]">
            • Mínimo {fmt(MIN)} · Máximo{" "}
            {fmt(Math.max(MIN, servicePrice || MIN))}
          </p>
          <p>• Pago seguro con Wompi</p>
          <p>• Confirmación instantánea</p>
        </div>
      </div>
    </div>
  );
}
