import React from "react";
import { format, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface DayPickerProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  availableDates?: Date[]; // Para marcar días sin disponibilidad
}

export default function DayPicker({
  selectedDate,
  onSelect,
  availableDates,
}: DayPickerProps) {
  // Generar próximos 14 días
  const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="grid grid-cols-7 sm:grid-cols-7 lg:grid-cols-7 gap-2">
      {days.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, new Date());

        return (
          <button
            key={date.toISOString()}
            type="button"
            onClick={() => onSelect(date)}
            className={`
              p-3 rounded-xl border transition-all duration-300 text-center
              ${
                isSelected
                  ? "bg-[#D4AF37] text-[#0B0B0B] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30"
                  : "bg-[#0B0B0B] border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-white"
              }
              ${isToday && !isSelected ? "ring-2 ring-[#D4AF37]/30" : ""}
              focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50
            `}
            aria-label={format(date, "EEEE d MMMM", { locale: es })}
            aria-pressed={isSelected}
          >
            <p className="text-xs capitalize">
              {format(date, "EEE", { locale: es })}
            </p>
            <p className="text-lg font-bold">{format(date, "d")}</p>
            {isToday && <p className="text-[8px] text-[#D4AF37]">HOY</p>}
          </button>
        );
      })}
    </div>
  );
}
