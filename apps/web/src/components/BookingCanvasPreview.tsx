import React, { useState } from "react";

// Tipos
interface Barber {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

// Mock Data
const barbers: Barber[] = [
  {
    id: "1",
    name: "Carlos Rodríguez",
    specialty: "Fade & Diseños",
    rating: 4.9,
    avatar: "👨‍🦱",
  },
  {
    id: "2",
    name: "Miguel Ángel",
    specialty: "Barbas & Afeitado",
    rating: 4.8,
    avatar: "🧔",
  },
  {
    id: "3",
    name: "Andrés Silva",
    specialty: "Cortes Clásicos",
    rating: 4.9,
    avatar: "👨",
  },
  {
    id: "4",
    name: "Juan Pablo",
    specialty: "Estilos Modernos",
    rating: 5.0,
    avatar: "👨‍🦰",
  },
];

const timeSlots: TimeSlot[] = [
  { time: "09:00", available: true },
  { time: "09:30", available: true },
  { time: "10:00", available: false },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "11:30", available: false },
  { time: "14:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: false },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "16:30", available: true },
  { time: "17:00", available: false },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "18:30", available: true },
];

const BookingCanvasPreview: React.FC = () => {
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [amount, setAmount] = useState<string>("50000");
  const [showBarberDropdown, setShowBarberDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Generar días para el calendario
  const generateWeekDays = () => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = generateWeekDays();

  const formatCurrency = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ""));
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (parseInt(value) >= 10000 || value === "") {
      setAmount(value);
    }
  };

  const isFormValid =
    selectedBarber && selectedDate && selectedTime && parseInt(amount) >= 10000;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white overflow-hidden relative">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37] rounded-full filter blur-3xl" />
      </div>

      {/* Header */}
      <header className="bg-[#1A1A1A]/80 backdrop-blur-lg border-b border-[#D4AF37]/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="text-[#0B0B0B] font-bold">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#D4AF37]">
                  KINGSMAN BARBER
                </h1>
                <p className="text-xs text-[#C7C7C7]">
                  Sistema de Reservas Premium
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step <= currentStep
                      ? "bg-[#D4AF37] w-8"
                      : "bg-[#C7C7C7]/30 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Columna Izquierda - Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Selección de Barbero */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">
                1. Elige tu Barbero
              </h2>

              {/* Dropdown Personalizado */}
              <div className="relative">
                <button
                  onClick={() => setShowBarberDropdown(!showBarberDropdown)}
                  className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-[#D4AF37]/50 transition-colors"
                >
                  {selectedBarber ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedBarber.avatar}</span>
                      <div>
                        <p className="font-semibold">{selectedBarber.name}</p>
                        <p className="text-xs text-[#C7C7C7]">
                          {selectedBarber.specialty}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[#C7C7C7]">
                      Selecciona un barbero...
                    </span>
                  )}
                  <svg
                    className={`w-5 h-5 text-[#D4AF37] transition-transform ${
                      showBarberDropdown ? "rotate-180" : ""
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

                {showBarberDropdown && (
                  <div className="absolute top-full mt-2 w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl overflow-hidden z-50">
                    {barbers.map((barber) => (
                      <button
                        key={barber.id}
                        onClick={() => {
                          setSelectedBarber(barber);
                          setShowBarberDropdown(false);
                          setCurrentStep(2);
                        }}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#D4AF37]/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{barber.avatar}</span>
                          <div className="text-left">
                            <p className="font-semibold">{barber.name}</p>
                            <p className="text-xs text-[#C7C7C7]">
                              {barber.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[#D4AF37]">★</span>
                          <span className="text-sm">{barber.rating}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Selección de Fecha */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">
                2. Selecciona la Fecha
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {weekDays.map((date, index) => {
                  const isSelected =
                    date.toDateString() === selectedDate.toDateString();
                  const dayName = date.toLocaleDateString("es-CO", {
                    weekday: "short",
                  });
                  const dayNumber = date.getDate();

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(date);
                        if (selectedBarber) setCurrentStep(3);
                      }}
                      className={`
                        p-3 rounded-xl border transition-all duration-300
                        ${
                          isSelected
                            ? "bg-[#D4AF37] text-[#0B0B0B] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30"
                            : "bg-[#0B0B0B] border-[#D4AF37]/20 hover:border-[#D4AF37]/50"
                        }
                      `}
                    >
                      <p className="text-xs capitalize">{dayName}</p>
                      <p className="text-lg font-bold">{dayNumber}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Selección de Hora */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">
                3. Elige la Hora
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (slot.available) {
                        setSelectedTime(slot.time);
                        if (selectedBarber && selectedDate) setCurrentStep(4);
                      }
                    }}
                    disabled={!slot.available}
                    className={`
                      py-2 px-3 rounded-xl border transition-all duration-300 text-sm font-medium
                      ${
                        selectedTime === slot.time
                          ? "bg-[#D4AF37] text-[#0B0B0B] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30"
                          : slot.available
                          ? "bg-[#0B0B0B] border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                          : "bg-[#0B0B0B]/50 border-[#C7C7C7]/10 text-[#C7C7C7]/30 cursor-not-allowed line-through"
                      }
                    `}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Pago */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">
                4. Confirma tu Pago
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#C7C7C7] mb-2 block">
                    Monto a pagar (mínimo $10.000 COP)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formatCurrency(amount)}
                      onChange={handleAmountChange}
                      className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-3 pr-12 focus:border-[#D4AF37]/50 focus:outline-none transition-colors text-white"
                      placeholder="$50.000"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C7C7C7]">
                      COP
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAmount("30000")}
                    className="bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl py-2 hover:border-[#D4AF37]/50 transition-colors"
                  >
                    $30.000
                  </button>
                  <button
                    onClick={() => setAmount("50000")}
                    className="bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl py-2 hover:border-[#D4AF37]/50 transition-colors"
                  >
                    $50.000
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#D4AF37]/10 rounded-xl">
                  <svg
                    className="w-5 h-5 text-[#D4AF37] flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-[#C7C7C7]">
                    El pago se procesará de forma segura con Wompi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Resumen */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0B0B0B] rounded-2xl p-6 border border-[#D4AF37]/20">
              <h3 className="text-xl font-bold mb-6 text-[#D4AF37]">
                Resumen de Reserva
              </h3>

              <div className="space-y-4">
                {/* Barbero */}
                <div className="flex items-center justify-between">
                  <span className="text-[#C7C7C7]">Barbero:</span>
                  <span className="font-semibold">
                    {selectedBarber ? selectedBarber.name : "---"}
                  </span>
                </div>

                {/* Fecha */}
                <div className="flex items-center justify-between">
                  <span className="text-[#C7C7C7]">Fecha:</span>
                  <span className="font-semibold">
                    {selectedDate.toLocaleDateString("es-CO", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                {/* Hora */}
                <div className="flex items-center justify-between">
                  <span className="text-[#C7C7C7]">Hora:</span>
                  <span className="font-semibold">{selectedTime || "---"}</span>
                </div>

                <div className="border-t border-[#D4AF37]/20 my-4" />

                {/* Total */}
                <div className="flex items-center justify-between text-lg">
                  <span className="text-[#C7C7C7]">Total:</span>
                  <span className="font-bold text-[#D4AF37] text-xl">
                    {formatCurrency(amount) || "$0"}
                  </span>
                </div>

                {/* Botón Confirmar */}
                <button
                  disabled={!isFormValid}
                  className={`
                    w-full py-4 rounded-xl font-bold transition-all duration-300 mt-6
                    ${
                      isFormValid
                        ? "bg-gradient-to-r from-[#D4AF37] to-[#F4D061] text-[#0B0B0B] hover:shadow-lg hover:shadow-[#D4AF37]/30 transform hover:scale-105"
                        : "bg-[#C7C7C7]/10 text-[#C7C7C7]/50 cursor-not-allowed"
                    }
                  `}
                >
                  {isFormValid
                    ? "Confirmar Reserva"
                    : "Completa todos los campos"}
                </button>

                {/* Info adicional */}
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
                    <p className="text-xs text-[#C7C7C7]">
                      Confirmación instantánea
                    </p>
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
                    <p className="text-xs text-[#C7C7C7]">Pago 100% seguro</p>
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

            {/* Testimonial Card */}
            <div className="mt-6 bg-[#1A1A1A]/50 rounded-2xl p-4 border border-[#D4AF37]/10">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#D4AF37]">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-[#C7C7C7] italic">
                "Excelente servicio, muy profesionales y puntuales. 100%
                recomendado."
              </p>
              <p className="text-xs text-[#C7C7C7] mt-2">- Juan Carlos M.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1A1A1A]/95 backdrop-blur-lg border-t border-[#D4AF37]/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#C7C7C7]">Total:</span>
          <span className="text-xl font-bold text-[#D4AF37]">
            {formatCurrency(amount) || "$0"}
          </span>
        </div>
        <button
          disabled={!isFormValid}
          className={`
            w-full py-3 rounded-xl font-bold transition-all duration-300
            ${
              isFormValid
                ? "bg-gradient-to-r from-[#D4AF37] to-[#F4D061] text-[#0B0B0B]"
                : "bg-[#C7C7C7]/10 text-[#C7C7C7]/50"
            }
          `}
        >
          {isFormValid ? "Confirmar Reserva" : "Completa el formulario"}
        </button>
      </div>
    </div>
  );
};

export default BookingCanvasPreview;
