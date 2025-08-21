// src/pages/TestBookingUtils.tsx
import React, { useState, useEffect } from "react";
import {
  generateSlots,
  filterTakenSlots,
  isSlotAvailable,
  timeToMinutes,
  calculateEndTime,
  groupSlotsByPeriod,
} from "@/utils/slots";
import {
  getWorkingSchedule,
  saveWorkingSchedule,
  getBarberSchedules,
} from "@/services/schedules";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
} from "@/services/appointments";
import wompiService from "@/services/wompi";
import type { Appointment, WorkingSchedule } from "@/types/booking";

export default function TestBookingUtils() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Test 1: Generar Slots
  const testGenerateSlots = () => {
    console.log("🧪 Test 1: Generando slots...");

    const slots = generateSlots("2025-08-19", "09:00", "18:00", 30);
    console.log("Slots generados:", slots);

    setResults((prev: any) => ({
      ...prev,
      slots: {
        total: slots.length,
        first: slots[0],
        last: slots[slots.length - 1],
        all: slots,
      },
    }));

    // Verificar que se generaron 18 slots (9 horas * 2 slots por hora)
    const expected = 18;
    const passed = slots.length === expected;
    console.log(`✅ Test passed: ${passed} (${slots.length} === ${expected})`);
  };

  // Test 2: Filtrar Slots Ocupados
  const testFilterSlots = () => {
    console.log("🧪 Test 2: Filtrando slots ocupados...");

    // Simular citas existentes
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        barberId: "barber1",
        userId: "user1",
        userPhone: "3001234567",
        userName: "Juan Pérez",
        date: "2025-08-19",
        start: "10:00",
        end: "11:00",
        price: 50000,
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
        payment: {
          provider: "wompi",
          amount: 50000,
          currency: "COP",
          ref: "REF-123",
          status: "APPROVED",
        },
      },
      {
        id: "2",
        barberId: "barber1",
        userId: "user2",
        userPhone: "3009876543",
        userName: "María García",
        date: "2025-08-19",
        start: "14:30",
        end: "15:30",
        price: 50000,
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
        payment: {
          provider: "wompi",
          amount: 50000,
          currency: "COP",
          ref: "REF-124",
          status: "APPROVED",
        },
      },
    ];

    const allSlots = generateSlots("2025-08-19", "09:00", "18:00", 30);
    const filteredSlots = filterTakenSlots(allSlots, mockAppointments);

    console.log("Slots filtrados:", filteredSlots);

    // Contar disponibles
    const available = filteredSlots.filter((s) => s.available).length;
    const occupied = filteredSlots.filter((s) => !s.available).length;

    setResults((prev: any) => ({
      ...prev,
      filtered: {
        total: filteredSlots.length,
        available,
        occupied,
        occupiedTimes: filteredSlots
          .filter((s) => !s.available)
          .map((s) => s.time),
      },
    }));

    console.log(`✅ Disponibles: ${available}, Ocupados: ${occupied}`);
  };

  // Test 3: Verificar Disponibilidad de Slot
  const testSlotAvailability = async () => {
    console.log("🧪 Test 3: Verificando disponibilidad...");

    const mockAppointments: Appointment[] = [
      {
        id: "1",
        barberId: "barber1",
        userId: "user1",
        userPhone: "3001234567",
        userName: "Test User",
        date: "2025-08-19",
        start: "10:00",
        end: "11:00",
        price: 50000,
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
        payment: {
          provider: "wompi",
          amount: 50000,
          currency: "COP",
          ref: "REF-125",
          status: "APPROVED",
        },
      },
    ];

    // Test slot ocupado
    const isOccupied = await isSlotAvailable(
      "2025-08-19",
      "10:30",
      "barber1",
      mockAppointments
    );

    // Test slot libre
    const isFree = await isSlotAvailable(
      "2025-08-19",
      "09:00",
      "barber1",
      mockAppointments
    );

    setResults((prev: any) => ({
      ...prev,
      availability: {
        "10:30_should_be_occupied": !isOccupied,
        "09:00_should_be_free": isFree,
      },
    }));

    console.log(`✅ 10:30 ocupado: ${!isOccupied}, 09:00 libre: ${isFree}`);
  };

  // Test 4: Utilidades de Tiempo
  const testTimeUtils = () => {
    console.log("🧪 Test 4: Probando utilidades de tiempo...");

    const tests = {
      timeToMinutes: timeToMinutes("14:30"), // Debería ser 870
      calculateEndTime: calculateEndTime("10:00", 90), // Debería ser 11:30
      groupedSlots: groupSlotsByPeriod([
        { time: "09:00", available: true },
        { time: "14:00", available: true },
        { time: "18:00", available: true },
      ]),
    };

    setResults((prev: any) => ({
      ...prev,
      timeUtils: tests,
    }));

    console.log("Resultados:", tests);
  };

  // Test 5: Firebase - Guardar y Obtener Horario
  const testFirebaseSchedule = async () => {
    console.log("🧪 Test 5: Probando Firebase Schedules...");
    setLoading(true);

    try {
      // Crear horario de prueba
      const testSchedule = {
        barberId: "test-barber-1",
        date: "2025-08-20",
        startTime: "09:00",
        endTime: "18:00",
        slotMinutes: 30,
      };

      // Guardar
      const scheduleId = await saveWorkingSchedule(testSchedule);
      console.log("✅ Horario guardado con ID:", scheduleId);

      // Obtener
      const retrieved = await getWorkingSchedule("test-barber-1", "2025-08-20");
      console.log("✅ Horario recuperado:", retrieved);

      // Obtener todos los horarios del barbero
      const allSchedules = await getBarberSchedules("test-barber-1");
      console.log("✅ Todos los horarios:", allSchedules);

      setResults((prev: any) => ({
        ...prev,
        firebase: {
          saved: scheduleId,
          retrieved: retrieved,
          allSchedules: allSchedules.length,
        },
      }));
    } catch (error) {
      console.error("❌ Error en Firebase:", error);
      setResults((prev: any) => ({
        ...prev,
        firebase: { error: error.message },
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test 6: Wompi Mock
  const testWompiMock = async () => {
    console.log("🧪 Test 6: Probando Wompi...");

    // Inicializar Wompi (sin credenciales = modo mock)
    wompiService.init();

    try {
      const result = await wompiService.openCheckout({
        amount: 50000,
        currency: "COP",
        reference: wompiService.generateReference("TEST"),
        customerName: "Usuario Prueba",
        customerEmail: "test@test.com",
        customerPhone: "3001234567",
        onSuccess: (transaction) => {
          console.log("✅ Transacción exitosa:", transaction);
          setResults((prev: any) => ({
            ...prev,
            wompi: {
              success: true,
              transaction,
            },
          }));
        },
        onError: (error) => {
          console.error("❌ Error en pago:", error);
          setResults((prev: any) => ({
            ...prev,
            wompi: {
              success: false,
              error,
            },
          }));
        },
      });
    } catch (error) {
      console.error("❌ Error en Wompi:", error);
    }
  };

  // Test 7: Crear Cita Completa
  const testCreateAppointment = async () => {
    console.log("🧪 Test 7: Creando cita...");
    setLoading(true);

    try {
      const newAppointment = {
        barberId: "test-barber-1",
        userId: "test-user-1",
        userPhone: "3001234567",
        userName: "Usuario Test",
        date: "2025-08-21",
        start: "10:00",
        end: "10:30",
        serviceName: "Corte Premium",
        price: 50000,
        status: "pending" as const,
        payment: {
          provider: "wompi" as const,
          amount: 50000,
          currency: "COP" as const,
          ref: wompiService.generateReference("TEST"),
          status: "PENDING" as const,
        },
      };

      const appointmentId = await createAppointment(newAppointment);
      console.log("✅ Cita creada con ID:", appointmentId);

      // Actualizar estado
      await updateAppointmentStatus(appointmentId, "confirmed");
      console.log("✅ Estado actualizado a confirmed");

      // Obtener citas del día
      const appointments = await getAppointments("test-barber-1", "2025-08-21");
      console.log("✅ Citas del día:", appointments);

      setResults((prev: any) => ({
        ...prev,
        appointment: {
          created: appointmentId,
          totalAppointments: appointments.length,
        },
      }));
    } catch (error) {
      console.error("❌ Error creando cita:", error);
      setResults((prev: any) => ({
        ...prev,
        appointment: { error: error.message },
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-8">
          🧪 Testing Suite - Sistema de Reservas
        </h1>

        {/* Botones de Test */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={testGenerateSlots}
            className="bg-[#1A1A1A] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl p-4 transition-all"
          >
            Test Slots
          </button>

          <button
            onClick={testFilterSlots}
            className="bg-[#1A1A1A] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl p-4 transition-all"
          >
            Test Filtrado
          </button>

          <button
            onClick={testSlotAvailability}
            className="bg-[#1A1A1A] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl p-4 transition-all"
          >
            Test Disponibilidad
          </button>

          <button
            onClick={testTimeUtils}
            className="bg-[#1A1A1A] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl p-4 transition-all"
          >
            Test Utils Tiempo
          </button>

          <button
            onClick={testFirebaseSchedule}
            disabled={loading}
            className="bg-[#1A1A1A] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl p-4 transition-all disabled:opacity-50"
          >
            Test Firebase Schedule
          </button>

          <button
            onClick={testWompiMock}
            className="bg-[#1A1A1A] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl p-4 transition-all"
          >
            Test Wompi Mock
          </button>

          <button
            onClick={testCreateAppointment}
            disabled={loading}
            className="bg-[#1A1A1A] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl p-4 transition-all disabled:opacity-50"
          >
            Test Crear Cita
          </button>

          <button
            onClick={() => setResults({})}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl p-4 transition-all"
          >
            Limpiar
          </button>
        </div>

        {/* Resultados */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/20">
          <h2 className="text-xl font-bold text-[#D4AF37] mb-4">Resultados:</h2>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
            </div>
          )}

          <pre className="bg-[#0B0B0B] rounded-xl p-4 overflow-x-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>

        {/* Instrucciones */}
        <div className="mt-8 bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/20">
          <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
            📝 Instrucciones:
          </h3>
          <ol className="space-y-2 text-[#C7C7C7]">
            <li>
              1. Abre la consola del navegador (F12) para ver logs detallados
            </li>
            <li>2. Ejecuta los tests en orden para mejor comprensión</li>
            <li>3. Test 1-4: Pruebas locales (no requieren Firebase)</li>
            <li>4. Test 5-7: Requieren Firebase configurado</li>
            <li>
              5. Test 6 (Wompi): Aceptar el diálogo para simular pago exitoso
            </li>
            <li>6. Revisa los resultados en el panel inferior</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
