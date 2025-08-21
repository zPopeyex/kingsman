import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { getActiveBarbers } from "@/services/barbers";
import {
  saveWorkingSchedule,
  getBarberSchedules,
  deleteWorkingSchedule,
} from "@/services/schedules";
import type { Barber, WorkingSchedule } from "@/types/booking";
import { fmtDate } from "@/utils/format";

export default function ScheduleEditor() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [schedules, setSchedules] = useState<WorkingSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBarbers, setLoadingBarbers] = useState(true);

  const [scheduleForm, setScheduleForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "19:00",
    slotMinutes: 30,
  });

  const [bulkMode, setBulkMode] = useState(false);
  const [bulkDays, setBulkDays] = useState(7);

  useEffect(() => {
    loadBarbers();
  }, []);

  useEffect(() => {
    if (selectedBarber) {
      loadSchedules();
    }
  }, [selectedBarber]);

  const loadBarbers = async () => {
    setLoadingBarbers(true);
    try {
      const data = await getActiveBarbers();
      setBarbers(data || []);
      if (data && data.length > 0) {
        setSelectedBarber(data[0].id);
      }
    } catch (error) {
      console.error("Error loading barbers:", error);
      toast.error("Error al cargar barberos");
      setBarbers([]);
    } finally {
      setLoadingBarbers(false);
    }
  };

  const loadSchedules = async () => {
    if (!selectedBarber) return;

    setLoading(true);
    try {
      const data = await getBarberSchedules(selectedBarber);
      const scheduleArray = Array.isArray(data) ? data : [];
      scheduleArray.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
      setSchedules(scheduleArray);
    } catch (error) {
      console.error("Error loading schedules:", error);
      toast.error("Error al cargar horarios");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBarber) {
      toast.error("Selecciona un barbero");
      return;
    }

    setLoading(true);
    try {
      if (bulkMode) {
        for (let i = 0; i < bulkDays; i++) {
          const date = addDays(new Date(scheduleForm.date + "T00:00:00"), i);
          await saveWorkingSchedule({
            barberId: selectedBarber,
            date: format(date, "yyyy-MM-dd"),
            startTime: scheduleForm.startTime,
            endTime: scheduleForm.endTime,
            slotMinutes: scheduleForm.slotMinutes,
          });
        }
        toast.success(`${bulkDays} horarios creados exitosamente`);
      } else {
        await saveWorkingSchedule({
          barberId: selectedBarber,
          date: scheduleForm.date,
          startTime: scheduleForm.startTime,
          endTime: scheduleForm.endTime,
          slotMinutes: scheduleForm.slotMinutes,
        });
        toast.success("Horario creado exitosamente");
      }

      await loadSchedules();
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Error al guardar horario");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm("¿Estás seguro de eliminar este horario?")) return;

    try {
      await deleteWorkingSchedule(scheduleId);
      toast.success("Horario eliminado");
      await loadSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Error al eliminar horario");
    }
  };

  const timeOptions: string[] = [];
  for (let hour = 7; hour <= 21; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, "0")}:00`);
    timeOptions.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  // Función para formatear fecha de manera segura
  const formatScheduleDate = (dateValue: any) => {
    try {
      // Si es un Timestamp de Firebase
      if (
        dateValue &&
        typeof dateValue === "object" &&
        "seconds" in dateValue
      ) {
        return format(new Date(dateValue.seconds * 1000), "EEE d MMM yyyy", {
          locale: es,
        });
      }
      // Si es una fecha string
      if (typeof dateValue === "string") {
        return format(new Date(dateValue + "T00:00:00"), "EEE d MMM yyyy", {
          locale: es,
        });
      }
      // Si es un Date object
      if (dateValue instanceof Date) {
        return format(dateValue, "EEE d MMM yyyy", { locale: es });
      }
      return "Fecha inválida";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha inválida";
    }
  };

  if (loadingBarbers) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!barbers || barbers.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10 text-center">
        <p className="text-[#C7C7C7]">No hay barberos registrados.</p>
        <p className="text-sm text-[#C7C7C7] mt-2">
          Los barberos se crean automáticamente al cargar la página de citas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector de barbero */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
        <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
          Seleccionar Barbero
        </h3>
        <select
          value={selectedBarber}
          onChange={(e) => setSelectedBarber(e.target.value)}
          className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]/50 focus:outline-none"
        >
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.displayName} - {barber.specialty || "Barbero"}
            </option>
          ))}
        </select>
      </div>

      {selectedBarber && (
        <>
          {/* Formulario de horario */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
              Agregar Horario
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#C7C7C7] mb-2">
                    Fecha inicial
                  </label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) =>
                      setScheduleForm({ ...scheduleForm, date: e.target.value })
                    }
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#C7C7C7] mb-2">
                    Duración del slot (minutos)
                  </label>
                  <select
                    value={scheduleForm.slotMinutes}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        slotMinutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#C7C7C7] mb-2">
                    Hora de inicio
                  </label>
                  <select
                    value={scheduleForm.startTime}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#C7C7C7] mb-2">
                    Hora de fin
                  </label>
                  <select
                    value={scheduleForm.endTime}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modo bulk */}
              <div className="border-t border-[#D4AF37]/20 pt-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={bulkMode}
                    onChange={(e) => setBulkMode(e.target.checked)}
                    className="w-4 h-4 text-[#D4AF37] bg-[#0B0B0B] border-[#D4AF37]/20 rounded focus:ring-[#D4AF37]"
                  />
                  <span className="text-white">
                    Crear múltiples días consecutivos
                  </span>
                </label>

                {bulkMode && (
                  <div className="mt-3">
                    <label className="block text-sm text-[#C7C7C7] mb-2">
                      Número de días
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={bulkDays}
                      onChange={(e) => setBulkDays(parseInt(e.target.value))}
                      className="w-32 bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#F4D061] disabled:bg-[#D4AF37]/50 text-[#0B0B0B] px-4 py-3 rounded-xl font-semibold transition-colors"
              >
                {loading
                  ? "Guardando..."
                  : bulkMode
                  ? `Crear ${bulkDays} horarios`
                  : "Guardar horario"}
              </button>
            </form>
          </div>

          {/* Lista de horarios */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
              Horarios Configurados
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
              </div>
            ) : schedules.length === 0 ? (
              <p className="text-[#C7C7C7] text-center py-8">
                No hay horarios configurados
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/20">
                      <th className="text-left py-2 text-sm text-[#D4AF37]">
                        Fecha
                      </th>
                      <th className="text-left py-2 text-sm text-[#D4AF37]">
                        Horario
                      </th>
                      <th className="text-left py-2 text-sm text-[#D4AF37]">
                        Slots
                      </th>
                      <th className="text-left py-2 text-sm text-[#D4AF37]">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr
                        key={schedule.id}
                        className="border-b border-[#D4AF37]/10"
                      >
                        <td className="py-3 text-white">
                          {formatScheduleDate(schedule.date)}
                        </td>
                        <td className="py-3 text-white">
                          {fmtDate(schedule.startTime, "HH:mm")} -{" "}
                          {fmtDate(schedule.endTime, "HH:mm0")}
                        </td>
                        <td className="py-3 text-white">
                          {schedule.slotMinutes} min
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
