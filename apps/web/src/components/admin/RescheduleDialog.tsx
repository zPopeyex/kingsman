import React, { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { rescheduleAppointment } from "@/services/appointments";
import type { Appointment } from "@/types/booking";

interface RescheduleDialogProps {
  appointment: Appointment;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RescheduleDialog({
  appointment,
  onClose,
  onSuccess,
}: RescheduleDialogProps) {
  const [newDate, setNewDate] = useState(appointment.date);
  const [newStartTime, setNewStartTime] = useState(appointment.start);
  const [newEndTime, setNewEndTime] = useState(appointment.end);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await rescheduleAppointment(
        appointment.id,
        newDate,
        newStartTime,
        newEndTime
      );

      toast.success("Cita reprogramada exitosamente");
      onSuccess();
    } catch (error: any) {
      console.error("Error rescheduling:", error);
      toast.error(error.message || "Error al reprogramar la cita");
    } finally {
      setLoading(false);
    }
  };

  const timeOptions: string[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, "0")}:00`);
    timeOptions.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full border border-[#D4AF37]/20">
        <h2 className="text-xl font-bold text-[#D4AF37] mb-4">
          Reprogramar Cita
        </h2>

        <div className="mb-4 p-3 bg-[#0B0B0B] rounded-xl">
          <p className="text-sm text-[#C7C7C7]">
            Cliente: {appointment.userName}
          </p>
          <p className="text-sm text-[#C7C7C7]">
            Servicio: {appointment.serviceName}
          </p>
          <p className="text-sm text-[#C7C7C7]">
            Fecha actual:{" "}
            {format(new Date(appointment.date + "T00:00:00"), "dd/MM/yyyy")}
          </p>
          <p className="text-sm text-[#C7C7C7]">
            Hora actual: {appointment.start} - {appointment.end}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#C7C7C7] mb-2">
              Nueva fecha
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#C7C7C7] mb-2">
                Hora inicio
              </label>
              <select
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                required
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
                Hora fin
              </label>
              <select
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                required
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#0B0B0B] hover:bg-[#1A1A1A] text-white px-4 py-2 rounded-xl font-semibold transition-colors border border-[#D4AF37]/20"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#D4AF37] hover:bg-[#F4D061] disabled:bg-[#D4AF37]/50 text-[#0B0B0B] px-4 py-2 rounded-xl font-semibold transition-colors"
            >
              {loading ? "Guardando..." : "Reprogramar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
