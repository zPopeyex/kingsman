import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Barber, Service } from "@/types/booking";

interface SummaryCardProps {
  barber: Barber | null;
  service: Service | null;
  date: Date;
  time: string;
  amount: number;
  onConfirm: () => void;
  loading?: boolean;
  isValid: boolean;
}

export default function SummaryCard({
  barber,
  service,
  date,
  time,
  amount,
  onConfirm,
  loading = false, // Valor por defecto
  isValid,
}: SummaryCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0B0B0B] rounded-2xl p-6 border border-[#D4AF37]/20">
      <h3 className="text-xl font-bold mb-6 text-[#D4AF37]">
        Resumen de Reserva
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[#C7C7C7]">Barbero:</span>
          <span className="font-semibold text-white">
            {barber ? barber.displayName : "---"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#C7C7C7]">Servicio:</span>
          <span className="font-semibold text-white">
            {service ? service.name : "---"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#C7C7C7]">Fecha:</span>
          <span className="font-semibold text-white">
            {format(date, "EEE d MMM", { locale: es })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#C7C7C7]">Hora:</span>
          <span className="font-semibold text-white">{time || "---"}</span>
        </div>

        {service && (
          <div className="flex items-center justify-between">
            <span className="text-[#C7C7C7]">Duración:</span>
            <span className="font-semibold text-white">
              {service.durationMinutes} min
            </span>
          </div>
        )}

        <div className="border-t border-[#D4AF37]/20 my-4" />

        <div className="flex items-center justify-between text-lg">
          <span className="text-[#C7C7C7]">Total a pagar:</span>
          <span className="font-bold text-[#D4AF37] text-xl">
            {formatCurrency(amount)}
          </span>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={!isValid || loading}
          className={`
            w-full py-4 rounded-xl font-bold transition-all duration-300 mt-6
            ${
              isValid && !loading
                ? "bg-gradient-to-r from-[#D4AF37] to-[#F4D061] text-[#0B0B0B] hover:shadow-lg hover:shadow-[#D4AF37]/30 transform hover:scale-105"
                : "bg-[#C7C7C7]/10 text-[#C7C7C7]/50 cursor-not-allowed"
            }
          `}
          aria-label="Confirmar reserva y proceder al pago"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Procesando...
            </span>
          ) : isValid ? (
            "Confirmar y Pagar"
          ) : (
            "Completa todos los campos"
          )}
        </button>

        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-xs text-[#C7C7C7]">Confirmación instantánea</p>
          </div>
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-xs text-[#C7C7C7]">Pago 100% seguro con Wompi</p>
          </div>
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs text-[#C7C7C7]">
              Cancelación gratuita hasta 2h antes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
