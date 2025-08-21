import React, { useState, useEffect } from "react";
import type { Barber } from "@/types/booking";
import { getActiveBarbers } from "@/services/barbers";

interface BarberSelectorProps {
  selectedBarber: Barber | null;
  onSelect: (barber: Barber) => void;
}

export default function BarberSelector({
  selectedBarber,
  onSelect,
}: BarberSelectorProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const data = await getActiveBarbers();
      setBarbers(data);
    } catch (error) {
      console.error("Error loading barbers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-[#1A1A1A] rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-[#D4AF37]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
        aria-label="Seleccionar barbero"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
      >
        {selectedBarber ? (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedBarber.avatar || "👤"}</span>
            <div>
              <p className="font-semibold text-white">
                {selectedBarber.displayName}
              </p>
              <p className="text-xs text-[#C7C7C7]">
                {selectedBarber.specialty}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-[#C7C7C7]">Selecciona un barbero...</span>
        )}
        <svg
          className={`w-5 h-5 text-[#D4AF37] transition-transform ${
            showDropdown ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl overflow-hidden z-50 shadow-lg">
          <ul role="listbox">
            {barbers.map((barber) => (
              <li key={barber.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(barber);
                    setShowDropdown(false);
                    console.log("Barbero seleccionado:", barber); // AGREGAR ESTA LÍNEA
                    onSelect(barber);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#D4AF37]/10 transition-colors text-left"
                  role="option"
                  aria-selected={selectedBarber?.id === barber.id}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{barber.avatar || "👤"}</span>
                    <div>
                      <p className="font-semibold text-white">
                        {barber.displayName}
                      </p>
                      <p className="text-xs text-[#C7C7C7]">
                        {barber.specialty}
                      </p>
                    </div>
                  </div>
                  {barber.role === "admin" && (
                    <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
