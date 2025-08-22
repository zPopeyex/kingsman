import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

// Componentes
import BarberSelector from "@/components/booking/BarberSelector";
import DayPicker from "@/components/booking/DayPicker";
import SlotGrid from "@/components/booking/SlotGrid";
import PaymentBoxWompi from "@/components/booking/PaymentBoxWompi";
import SummaryCard from "@/components/booking/SummaryCard";

// Servicios
import { getWorkingSchedule } from "@/services/schedules";
import { getAppointments, createAppointment } from "@/services/appointments";
import { getServices } from "@/services/services";
import wompiService from "@/services/wompi";

// Utils
import {
  generateSlots,
  filterTakenSlots,
  calculateEndTime,
} from "@/utils/slots";

// Tipos
// Tipos
import type { Barber, Service, TimeSlot, Appointment } from "@/types/booking";

// Auth
import { useAuth } from "@/features/auth/AuthProvider";
import LoginScreen from "@/features/auth/LoginScreen";

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados principales
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [amount, setAmount] = useState<number>(selectedService?.price ?? 0);
  const [userEditedAmount, setUserEditedAmount] = useState(false);

  // Estados de UI
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Cargar servicios al montar
  useEffect(() => {
    const services = getServices();
    if (services.length > 0) {
      setSelectedService(services[1]); // Por defecto: Corte Premium
    }
  }, []);

  useEffect(() => {
    if (!selectedService) return;
    setAmount((prev) => {
      if (!userEditedAmount) return selectedService.price;
      return Math.min(prev, selectedService.price);
    });
  }, [selectedService?.price, userEditedAmount]);

  // Cargar slots cuando cambia barbero o fecha
  useEffect(() => {
    if (selectedBarber && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedBarber, selectedDate]);

  const loadAvailableSlots = async () => {
    if (!selectedBarber) return;

    setLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      // Obtener horario de trabajo
      const schedule = await getWorkingSchedule(selectedBarber.id, dateStr);

      if (!schedule) {
        setAvailableSlots([]);
        toast.error("No hay horario disponible para esta fecha");
        return;
      }

      // Generar slots
      const allSlots = generateSlots(
        dateStr,
        schedule.startTime,
        schedule.endTime,
        schedule.slotMinutes
      );

      // Obtener citas existentes
      const appointments = await getAppointments(selectedBarber.id, dateStr);

      // Filtrar slots ocupados
      const slotsWithAvailability = filterTakenSlots(allSlots, appointments);
      setAvailableSlots(slotsWithAvailability);

      if (slotsWithAvailability.filter((s) => s.available).length === 0) {
        toast.error("No hay horarios disponibles para esta fecha");
      }
    } catch (error) {
      console.error("Error loading slots:", error);
      toast.error("Error al cargar horarios disponibles");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirmBooking = async () => {
    // Validar auth on-demand
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedBarber || !selectedService || !selectedTime || !amount) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setProcessing(true);

    try {
      // Inicializar Wompi
      wompiService.init();

      // Generar referencia
      const reference = wompiService.generateReference("KB");

      // Crear cita en estado pending
      const appointmentData: Omit<
        Appointment,
        "id" | "createdAt" | "updatedAt"
      > = {
        barberId: selectedBarber.id,
        userId: user.uid,
        userPhone: user.phoneNumber || "",
        userName: user.displayName || user.email || "Cliente",
        date: format(selectedDate, "yyyy-MM-dd"),
        start: selectedTime,
        end: calculateEndTime(selectedTime, selectedService.durationMinutes),
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        price: amount,
        status: "pending",
        payment: {
          provider: "wompi",
          amount,
          currency: "COP",
          ref: reference,
          status: "PENDING",
        },
      };

      const appointmentId = await createAppointment(appointmentData);

      // Abrir checkout de Wompi
      await wompiService.openCheckout({
        amount,
        currency: "COP",
        reference,
        customerEmail: user.email || undefined,
        customerName: user.displayName || undefined,
        customerPhone: user.phoneNumber || undefined,
        onSuccess: async (transaction) => {
          toast.success("¡Pago exitoso! Redirigiendo...");

          // Navegar a página de confirmación
          navigate("/booking/success", {
            state: {
              appointmentId,
              transaction,
              appointment: appointmentData,
            },
          });
        },
        onError: (error) => {
          console.error("Error en pago:", error);
          toast.error("Error al procesar el pago");
        },
      });
    } catch (error: unknown) {
      console.error("Error creating booking:", error);
      const message =
        error instanceof Error ? error.message : "Error al crear la reserva";
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const isFormValid: boolean = Boolean(
    selectedBarber &&
      selectedService &&
      selectedDate &&
      selectedTime &&
      amount >= 10000
  );

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-8 pb-32 md:pb-8">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1A1A1A",
            color: "#fff",
            border: "1px solid #D4AF37",
          },
        }}
      />

      <div className="container mx-auto px-4 max-w-7xl pt-7">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2">
            Reserva tu Cita
          </h1>
          <p className="text-[#C7C7C7]">
            Selecciona tu barbero preferido y el horario que mejor te convenga
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 2: Barbero */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
              <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">
                1. Elige tu Barbero
              </h2>
              <BarberSelector
                selectedBarber={selectedBarber}
                onSelect={(barber) => {
                  setSelectedBarber(barber);
                  setCurrentStep(1);
                }}
              />
            </div>
            {/* Step 1: Servicio */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
              <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">
                2. Selecciona el Servicio
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getServices().map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(service);
                      setCurrentStep(2);
                    }}
                    className={`
                      p-4 rounded-xl border text-left transition-all
                      ${
                        selectedService?.id === service.id
                          ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white"
                          : "bg-[#0B0B0B] border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-white"
                      }
                    `}
                  >
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-[#C7C7C7] mt-1">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#D4AF37] font-bold">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(service.price)}
                      </span>
                      <span className="text-xs text-[#C7C7C7]">
                        {service.durationMinutes} min
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Fecha */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
              <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">
                3. Selecciona la Fecha
              </h2>
              <DayPicker
                selectedDate={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (selectedBarber) setCurrentStep(3);
                }}
              />
            </div>

            {/* Step 4: Hora */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
              <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">
                4. Elige la Hora
              </h2>
              <SlotGrid
                slots={availableSlots}
                selectedTime={selectedTime}
                onSelect={(time) => {
                  setSelectedTime(time);
                  setCurrentStep(4);
                }}
                loading={loadingSlots}
              />
            </div>

            {/* Step 5: Pago */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
              <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">
                5. Confirma tu Pago
              </h2>
              <PaymentBoxWompi
                servicePrice={selectedService?.price ?? 0}
                amount={amount}
                setAmount={setAmount}
                userEditedAmount={userEditedAmount}
                setUserEditedAmount={setUserEditedAmount}
              />
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:sticky lg:top-24 h-fit">
            <SummaryCard
              barber={selectedBarber}
              service={selectedService}
              date={selectedDate}
              time={selectedTime}
              amount={amount}
              onConfirm={handleConfirmBooking}
              loading={processing}
              isValid={isFormValid}
            />
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-8 pt-5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step <= currentStep
                      ? "bg-[#D4AF37] w-12"
                      : "bg-[#C7C7C7]/30 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#1A1A1A] rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">
              Inicia sesión para continuar
            </h2>
            <LoginScreen />
            <button
              onClick={() => {
                setShowLoginModal(false);
                // Verificar si el usuario se logueó y continuar
                if (user) {
                  handleConfirmBooking();
                }
              }}
              className="mt-4 w-full bg-[#D4AF37] text-[#0B0B0B] py-2 rounded-xl font-semibold"
            >
              Continuar
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-2 w-full text-[#C7C7C7] hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
