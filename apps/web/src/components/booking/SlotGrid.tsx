import React from "react";
import type { TimeSlot } from "@/types/booking";
import { groupSlotsByPeriod } from "@/utils/slots";

interface SlotGridProps {
  slots: TimeSlot[];
  selectedTime: string;
  onSelect: (time: string) => void;
  loading?: boolean;
}

export default function SlotGrid({
  slots,
  selectedTime,
  onSelect,
  loading,
}: SlotGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-10 bg-[#1A1A1A] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#C7C7C7]">
          No hay horarios disponibles para esta fecha
        </p>
      </div>
    );
  }

  const grouped = groupSlotsByPeriod(slots);

  return (
    <div className="space-y-4">
      {grouped.morning.length > 0 && (
        <div>
          <h4 className="text-sm text-[#C7C7C7] mb-2">Mañana</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {grouped.morning.map((slot) => (
              <SlotButton
                key={slot.time}
                slot={slot}
                isSelected={selectedTime === slot.time}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}

      {grouped.afternoon.length > 0 && (
        <div>
          <h4 className="text-sm text-[#C7C7C7] mb-2">Tarde</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {grouped.afternoon.map((slot) => (
              <SlotButton
                key={slot.time}
                slot={slot}
                isSelected={selectedTime === slot.time}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}

      {grouped.evening.length > 0 && (
        <div>
          <h4 className="text-sm text-[#C7C7C7] mb-2">Noche</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {grouped.evening.map((slot) => (
              <SlotButton
                key={slot.time}
                slot={slot}
                isSelected={selectedTime === slot.time}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SlotButton({
  slot,
  isSelected,
  onSelect,
}: {
  slot: TimeSlot;
  isSelected: boolean;
  onSelect: (time: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => slot.available && onSelect(slot.time)}
      disabled={!slot.available}
      className={`
        py-2 px-3 rounded-xl border transition-all duration-300 text-sm font-medium
        ${
          isSelected
            ? "bg-[#D4AF37] text-[#0B0B0B] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30"
            : slot.available
            ? "bg-[#0B0B0B] border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] text-white"
            : "bg-[#0B0B0B]/50 border-[#C7C7C7]/10 text-[#C7C7C7]/30 cursor-not-allowed line-through"
        }
        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50
        disabled:hover:border-[#C7C7C7]/10 disabled:hover:text-[#C7C7C7]/30
      `}
      aria-label={`${slot.time} ${slot.available ? "disponible" : "ocupado"}`}
      aria-pressed={isSelected}
    >
      {slot.time}
    </button>
  );
}
