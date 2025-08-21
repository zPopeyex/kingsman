import React from "react";
import wompiService from "@/services/wompi";
import { formatCOP } from "@/lib/money";

type Props = {
  servicePrice: number;
  amount: number;
  setAmount: (v: number) => void;
  userEditedAmount: boolean;
  setUserEditedAmount: (v: boolean) => void;
};

const MIN = 10_000;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(v, hi));
const parseCOP = (s: string) => Number(String(s).replace(/[^\d]/g, "")) || 0;

export default function PaymentBoxWompi({
  servicePrice,
  amount,
  setAmount,
  userEditedAmount,
  setUserEditedAmount,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = clamp(parseCOP(e.target.value), MIN, servicePrice || MIN);
    setAmount(n);
    if (!userEditedAmount) setUserEditedAmount(true);
  };

  const suggestions = React.useMemo(() => {
    if (!servicePrice) return [];
    const values = [MIN, Math.round(servicePrice / 2), servicePrice];
    return Array.from(
      new Set(values.filter((v) => v >= MIN && v <= servicePrice))
    ).sort((a, b) => a - b);
  }, [servicePrice]);

  const validation = wompiService.validateAmount(amount, MIN, servicePrice || undefined);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-[#C7C7C7] mb-2">
          Valor del servicio
        </label>
        <div className="bg-[#1A1A1A]/50 rounded-xl p-3 border border-[#D4AF37]/10">
          <p className="text-2xl font-bold text-[#D4AF37]">
            {formatCOP(servicePrice)}
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="payment-amount"
          className="block text-sm text-[#C7C7C7] mb-2"
        >
          Monto a pagar (anticipo o total)
        </label>
        <div className="relative">
          <input
            id="payment-amount"
            type="text"
            value={formatCOP(amount)}
            onChange={handleChange}
            className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-3 pr-12 focus:border-[#D4AF37]/50 focus:outline-none transition-colors text-white"
            placeholder={formatCOP(MIN)}
            inputMode="numeric"
            aria-label="Monto a pagar"
            aria-invalid={!validation.valid}
            aria-describedby={!validation.valid ? "amount-error" : undefined}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C7C7C7]">
            COP
          </span>
        </div>
        {!validation.valid && (
          <p id="amount-error" className="mt-1 text-xs text-red-500">
            {validation.error}
          </p>
        )}
      </div>

      <div>
        <p className="text-xs text-[#C7C7C7] mb-2">Montos sugeridos:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {suggestions.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => {
                setAmount(quickAmount);
                if (!userEditedAmount) setUserEditedAmount(true);
              }}
              className={`
                py-2 px-3 rounded-xl border transition-colors text-sm
                ${
                  amount === quickAmount
                    ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                    : "bg-[#0B0B0B] border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-white"
                }
              `}
              aria-label={`Seleccionar ${formatCOP(quickAmount)}`}
            >
              {formatCOP(quickAmount)}
            </button>
          ))}
        </div>
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
          <p>• Mínimo: {formatCOP(MIN)}</p>
          <p>• Pago seguro con Wompi</p>
          <p>• Confirmación instantánea</p>
        </div>
      </div>
    </div>
  );
}
