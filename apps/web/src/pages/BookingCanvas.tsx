import { useState, useMemo } from "react";
import type { FC, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Scissors,
  User,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import {
  generateSlots,
  filterTakenSlots,
  calculateEndTime,
} from "@/utils/slots";
import { wompiService } from "@/services/wompi";
import { createAppointment } from "@/services/appointments";
import type { Appointment, Barber, Service } from "@/types/booking";

/* -------------------------------- Types --------------------------------- */

type StepProps = {
  title: string;
  subtitle?: string;
  /** Componente de ícono (lucide) */
  icon?: React.ComponentType<{ className?: string }>;
  children?: ReactNode;
};

type StepHeaderProps = {
  step: number;
  of: number;
  onBack?: () => void;
};

type MoneyProps = {
  value: number;
};

/* ------------------------------- Mock data ------------------------------- */

const BARBERS: Barber[] = [
  {
    id: "b-steven",
    displayName: "Steven",
    phone: "3001234567",
    role: "admin",
    active: true,
    avatar: "https://i.pravatar.cc/100?img=12",
    specialty: "Cortes premium",
  },
  {
    id: "b-andres",
    displayName: "Andrés",
    phone: "3009876543",
    role: "client",
    active: true,
    avatar: "https://i.pravatar.cc/100?img=5",
    specialty: "Barbas & Fade",
  },
  {
    id: "b-lina",
    displayName: "Lina",
    phone: "3005551212",
    role: "client",
    active: true,
    avatar: "https://i.pravatar.cc/100?img=32",
    specialty: "Estilo clásico",
  },
];

const SERVICES: Service[] = [
  { id: "srv-cut", name: "Corte Premium", durationMinutes: 30, price: 50000 },
  {
    id: "srv-beard",
    name: "Barba + Perfilado",
    durationMinutes: 30,
    price: 40000,
  },
  {
    id: "srv-combo",
    name: "Combo Corte + Barba",
    durationMinutes: 60,
    price: 80000,
  },
];

/* ----------------------------- UI Components ----------------------------- */

const Step: FC<StepProps> = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-[#111] border border-[#D4AF37]/20 rounded-2xl p-5 md:p-6 shadow-xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30">
        {Icon ? <Icon className="w-5 h-5 text-[#D4AF37]" /> : null}
      </div>
      <div>
        <h3 className="text-[#D4AF37] font-semibold tracking-wide">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

const StepHeader: FC<StepHeaderProps> = ({ step, of, onBack }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="text-neutral-400 text-sm">
      Paso {step} de {of}
    </div>
    {onBack && (
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-neutral-300 hover:text-white transition text-sm"
      >
        <ChevronLeft className="w-4 h-4" /> Volver
      </button>
    )}
  </div>
);

const Money: FC<MoneyProps> = ({ value }) => (
  <span>
    {new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)}
  </span>
);

/* ----------------------------- Main Component ---------------------------- */

export default function BookingCanvas() {
  const [step, setStep] = useState(1);
  const [barber, setBarber] = useState<Barber>(BARBERS[0]);
  const [service, setService] = useState<Service>(SERVICES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const total = service?.price ?? 0;

  // Slots disponibles
  const allSlots = useMemo(
    () => generateSlots(date, "09:00", "18:00", 30),
    [date]
  );
  const filteredSlots = useMemo(
    () => filterTakenSlots(allSlots, []),
    [allSlots]
  );

  const payNow = async () => {
    setIsPaying(true);
    wompiService.init();
    try {
      await wompiService.openCheckout({
        amount: total,
        currency: "COP",
        reference: wompiService.generateReference("BOOK"),
        customerName: name,
        customerPhone: phone,
        customerEmail: "demo@demo.com",
      });

      const newAppointment: Omit<
        Appointment,
        "id" | "createdAt" | "updatedAt"
      > = {
        barberId: barber.id,
        userId: "demo-user",
        userPhone: phone,
        userName: name,
        date,
        start: slot!, // validado en UI
        end: calculateEndTime(slot!, service.durationMinutes),
        serviceId: service.id,
        serviceName: service.name,
        price: total,
        status: "confirmed",
        payment: {
          provider: "wompi",
          amount: total,
          currency: "COP",
          ref: wompiService.generateReference("BOOK"),
          status: "APPROVED",
        },
      };

      await createAppointment(newAppointment);
      setStep(5);
    } catch (err) {
      console.error("❌ Error en el flujo de pago/reserva", err);
    } finally {
      setIsPaying(false);
    }
  };

  const canNext4 = !!slot && !!name && /^3\d{9}$/.test(phone);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#D4AF37]">
            Kingsman Barber · Reserva
          </h1>
          <p className="text-neutral-400 mt-1">
            Canvas conectado a utils y servicios reales.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {/* Paso 1: Barbero */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StepHeader step={1} of={5} />
              <Step
                title="Elige tu barbero"
                subtitle="Todos son cracks"
                icon={User}
              >
                <div className="grid sm:grid-cols-3 gap-3">
                  {BARBERS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBarber(b)}
                      className={`group border rounded-2xl p-4 flex items-center gap-3 transition bg-[#0c0c0c] hover:bg-[#111] ${
                        barber.id === b.id
                          ? "border-[#D4AF37]"
                          : "border-[#D4AF37]/20"
                      }`}
                    >
                      <img
                        src={b.avatar}
                        alt="avatar"
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="text-left">
                        <div className="font-medium">{b.displayName}</div>
                        <div className="text-xs text-neutral-400">
                          {b.specialty}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold"
                  >
                    Continuar <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </Step>
            </motion.div>
          )}

          {/* Paso 2: Servicio */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StepHeader step={2} of={5} onBack={() => setStep(1)} />
              <Step title="Servicio" subtitle="Selecciona uno" icon={Scissors}>
                <div className="grid sm:grid-cols-3 gap-3">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setService(s)}
                      className={`border rounded-2xl p-4 text-left bg-[#0c0c0c] hover:bg-[#111] transition ${
                        service.id === s.id
                          ? "border-[#D4AF37]"
                          : "border-[#D4AF37]/20"
                      }`}
                    >
                      <div className="font-medium">{s.name}</div>
                      <div className="text-sm text-neutral-400 mt-1">
                        {s.durationMinutes} min · <Money value={s.price} />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold"
                  >
                    Continuar <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </Step>
            </motion.div>
          )}

          {/* Paso 3: Fecha y hora */}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StepHeader step={3} of={5} onBack={() => setStep(2)} />
              <Step
                title="Fecha y hora"
                subtitle="Escoge tu disponibilidad"
                icon={CalendarDays}
              >
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mb-4 w-full bg-black border border-[#D4AF37]/30 rounded-xl p-2"
                />
                <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {filteredSlots.map((s) => (
                    <button
                      key={s.time}
                      onClick={() => setSlot(s.time)}
                      className={`px-3 py-2 rounded-xl border ${
                        slot === s.time
                          ? "border-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-[#D4AF37]/20 bg-[#0c0c0c]"
                      }`}
                      disabled={!s.available}
                    >
                      {s.time} –{" "}
                      {calculateEndTime(s.time, service.durationMinutes)}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    disabled={!slot}
                    onClick={() => setStep(4)}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold disabled:opacity-50"
                  >
                    Continuar <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </Step>
            </motion.div>
          )}

          {/* Paso 4: Datos + Pago */}
          {step === 4 && (
            <motion.div
              key="s4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StepHeader step={4} of={5} onBack={() => setStep(3)} />
              <Step
                title="Datos y pago"
                subtitle="Confirma tus datos"
                icon={CreditCard}
              >
                <div className="grid gap-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="bg-black border border-[#D4AF37]/30 rounded-xl p-2"
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="3XXXXXXXXX"
                    className="bg-black border border-[#D4AF37]/30 rounded-xl p-2"
                  />
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    disabled={!canNext4 || isPaying}
                    onClick={payNow}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold disabled:opacity-50 flex items-center gap-2"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Procesando…
                      </>
                    ) : (
                      <>
                        Pagar <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </Step>
            </motion.div>
          )}

          {/* Paso 5: Confirmación */}
          {step === 5 && (
            <motion.div
              key="s5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StepHeader step={5} of={5} />
              <Step
                title="¡Reserva confirmada!"
                subtitle="Te esperamos en Kingsman"
                icon={BadgeCheck}
              >
                <div className="p-4 bg-[#0c0c0c] border border-[#D4AF37]/20 rounded-2xl">
                  <p className="mb-2">
                    {service.name} con {barber.displayName}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {date} · {slot} –{" "}
                    {calculateEndTime(slot || "00:00", service.durationMinutes)}
                  </p>
                  <p className="mt-2 font-semibold">
                    <Money value={total} />
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setStep(1);
                      setSlot(null);
                      setName("");
                      setPhone("");
                    }}
                    className="px-3 py-2 rounded-xl border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10"
                  >
                    Nueva reserva
                  </button>
                </div>
              </Step>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
