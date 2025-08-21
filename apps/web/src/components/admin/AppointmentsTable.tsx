import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";

import {
  getAppointmentsByDateRange,
  updateAppointmentStatus,
} from "@/services/appointments";
import { getActiveBarbers } from "@/services/barbers";
import type { Appointment, Barber } from "@/types/booking";
import RescheduleDialog from "./RescheduleDialog";

/* =================== Utils a prueba de {seconds,nanoseconds} =================== */

// Detecta objetos "plain" con forma de Timestamp (cuando pasó por JSON)
const isPlainTimestamp = (
  v: any
): v is { seconds: number; nanoseconds: number } =>
  v &&
  typeof v === "object" &&
  typeof v.seconds === "number" &&
  typeof v.nanoseconds === "number";

const toDateSafe = (v: unknown): Date | null => {
  if (v == null) return null;
  if (v instanceof Date) return v;
  if (v instanceof Timestamp) return v.toDate();
  if (isPlainTimestamp(v)) {
    const ms = v.seconds * 1000 + Math.floor(v.nanoseconds / 1e6);
    return new Date(ms);
  }
  if (typeof v === "string") {
    // "YYYY-MM-DD" o ISO
    const d = v.length <= 10 ? new Date(v + "T00:00:00") : new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(v as any);
  return isNaN(d.getTime()) ? null : d;
};

const fmtDate = (v: unknown, pattern = "d/M/yyyy") => {
  const d = toDateSafe(v);
  return d ? format(d, pattern, { locale: es }) : "";
};
const fmtDateLargo = (v: unknown) => {
  const d = toDateSafe(v);
  return d ? format(d, "EEEE d MMMM", { locale: es }) : "";
};
const fmtTime = (v: unknown) => {
  if (typeof v === "string") return v;
  const d = toDateSafe(v);
  return d ? format(d, "hh:mm a", { locale: es }) : "";
};
const fmtMoney = (value: unknown) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

/* ================ <SafeTd>: sanea todo lo que reciba como children ================ */

const sanitizeNode = (node: unknown): React.ReactNode => {
  if (node == null || typeof node === "boolean") return null;

  // Elemento React -> sanitiza sus hijos usando el 3er argumento de cloneElement
  if (React.isValidElement(node)) {
    const el = node as React.ReactElement<any>;
    const child = el.props?.children;
    return React.cloneElement(
      el,
      undefined, // no sobreescribimos props
      React.Children.map(child, sanitizeNode) // <- los children van aquí
    );
  }

  // Primitivos OK
  if (typeof node === "string" || typeof node === "number") return node;

  // Arrays -> sanitiza cada item
  if (Array.isArray(node)) return node.map(sanitizeNode);

  // Intenta tratarlo como fecha (Date/Timestamp/{seconds,nanoseconds})
  const isPlainTs =
    typeof node === "object" &&
    node !== null &&
    typeof (node as any).seconds === "number" &&
    typeof (node as any).nanoseconds === "number";

  const toDate = (v: any): Date | null => {
    if (v instanceof Date) return v;
    if (typeof v === "string") {
      const d = v.length <= 10 ? new Date(v + "T00:00:00") : new Date(v);
      return isNaN(d.getTime()) ? null : d;
    }
    if (isPlainTs) {
      const ts = v as { seconds: number; nanoseconds: number };
      return new Date(ts.seconds * 1000 + Math.floor(ts.nanoseconds / 1e6));
    }
    return null;
  };

  const d = toDate(node);
  if (d) return d.toLocaleString(); // o tu formateo preferido

  // Último recurso: stringificar objeto
  try {
    return JSON.stringify(node);
  } catch {
    return String(node);
  }
};

// Y mantén SafeTd así:
const SafeTd: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  ...rest
}) => {
  return <td {...rest}>{React.Children.map(children, sanitizeNode)}</td>;
};

/* =================== Componente =================== */

export default function AppointmentsTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBarber, setSelectedBarber] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [rescheduleAppointment, setRescheduleAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedBarber, selectedStatus]);

  const loadData = async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const [appointmentsData, barbersData] = await Promise.all([
        getAppointmentsByDateRange(dateStr, dateStr),
        getActiveBarbers(),
      ]);

      let filtered = appointmentsData;

      if (selectedBarber !== "all") {
        filtered = filtered.filter(
          (a) => String(a.barberId) === selectedBarber
        );
      }
      if (selectedStatus !== "all") {
        filtered = filtered.filter((a) => String(a.status) === selectedStatus);
      }

      filtered.sort((a, b) => {
        const sa = fmtTime(a.start);
        const sb = fmtTime(b.start);
        return sa.localeCompare(sb, "es");
      });

      setAppointments(filtered);
      setBarbers(barbersData);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: "confirmed" | "cancelled"
  ) => {
    try {
      const reason =
        newStatus === "cancelled"
          ? prompt("Motivo de cancelación:") ?? undefined
          : undefined;

      if (newStatus === "cancelled" && !reason) return;

      await updateAppointmentStatus(appointmentId, newStatus, reason);
      toast.success(
        `Cita ${newStatus === "confirmed" ? "confirmada" : "cancelada"}`
      );
      loadData();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Error al actualizar la cita");
    }
  };

  const formatCurrency = (value: number) => fmtMoney(value);

  const getStatusBadge = (statusLike: unknown) => {
    const status = String(statusLike ?? "");
    const styles: Record<string, string> = {
      confirmed: "bg-green-500/20 text-green-500",
      pending: "bg-yellow-500/20 text-yellow-500",
      cancelled: "bg-red-500/20 text-red-500",
      rescheduled: "bg-blue-500/20 text-blue-500",
      failed: "bg-gray-500/20 text-gray-500",
    };
    const labels: Record<string, string> = {
      confirmed: "Confirmada",
      pending: "Pendiente",
      cancelled: "Cancelada",
      rescheduled: "Reprogramada",
      failed: "Fallida",
    };
    const cls = styles[status] ?? "bg-gray-500/20 text-gray-400";
    const txt = labels[status] ?? status;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
        {txt}
      </span>
    );
  };

  const getBarberName = (barberId: string) => {
    const barber = barbers.find((b) => b.id === barberId);
    return barber?.displayName || barberId;
  };

  const generateWhatsAppLink = (appointment: Appointment) => {
    const message = encodeURIComponent(
      `Hola ${appointment.userName}! Te recordamos tu cita:\n` +
        `📅 ${fmtDateLargo(appointment.date)}\n` +
        `⏰ ${fmtTime(appointment.start)}\n` +
        `💈 ${appointment.serviceName}\n` +
        `Barbero: ${getBarberName(String(appointment.barberId))}`
    );
    return `https://wa.me/57${String(appointment.userPhone)}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      {/* Nota informativa */}
      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-4">
        <p className="text-sm text-[#D4AF37]">
          📌 <strong>Estados de las citas:</strong>
        </p>
        <ul className="text-xs text-[#C7C7C7] mt-2 space-y-1">
          <li>
            • <strong>Pendiente:</strong> Pago realizado, esperando confirmación
            del barbero
          </li>
          <li>
            • <strong>Confirmada:</strong> Barbero confirmó, cliente
            atendido/por atender
          </li>
          <li>
            • <strong>Reprogramada:</strong> Fecha/hora cambiada, mantiene el
            pago
          </li>
          <li>
            • <strong>Cancelada:</strong> Cita cancelada (requiere reembolso
            manual)
          </li>
        </ul>
      </div>
      {/* Filtros */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-[#C7C7C7] mb-2">Fecha</label>
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) =>
                setSelectedDate(new Date(e.target.value + "T00:00:00"))
              }
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[#C7C7C7] mb-2">Barbero</label>
            <select
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
            >
              <option value="all">Todos</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.displayName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#C7C7C7] mb-2">Estado</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="confirmed">Confirmadas</option>
              <option value="pending">Pendientes</option>
              <option value="cancelled">Canceladas</option>
              <option value="rescheduled">Reprogramadas</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadData}
              className="w-full bg-[#D4AF37] hover:bg-[#F4D061] text-[#0B0B0B] px-4 py-2 rounded-xl font-semibold transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-[#D4AF37]/10 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#C7C7C7]">No hay citas para mostrar</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#0B0B0B] border-b border-[#D4AF37]/20">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Barbero
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {appointments.map((appointment) => (
                  <tr
                    key={String(appointment.id)}
                    className="hover:bg-[#0B0B0B]/50 transition-colors"
                  >
                    <SafeTd className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {fmtTime(appointment.start)}
                      {appointment.end ? ` - ${fmtTime(appointment.end)}` : ""}
                    </SafeTd>

                    <SafeTd className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-white">
                          {appointment.userName}
                        </p>
                        <p className="text-xs text-[#C7C7C7]">
                          {appointment.userPhone}
                        </p>
                      </div>
                    </SafeTd>

                    <SafeTd className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {appointment.serviceName || "Sin especificar"}
                    </SafeTd>

                    <SafeTd className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {getBarberName(String(appointment.barberId))}
                    </SafeTd>

                    <SafeTd className="px-6 py-4 whitespace-nowrap text-sm text-[#D4AF37] font-semibold">
                      {formatCurrency(Number(appointment.price || 0))}
                    </SafeTd>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(String(appointment.status))}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {appointment.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  String(appointment.id),
                                  "confirmed"
                                )
                              }
                              className="text-green-500 hover:text-green-400"
                              title="Confirmar"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  String(appointment.id),
                                  "cancelled"
                                )
                              }
                              className="text-red-500 hover:text-red-400"
                              title="Cancelar"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setRescheduleAppointment(appointment)}
                          className="text-blue-500 hover:text-blue-400"
                          title="Reprogramar"
                        >
                          🔄
                        </button>
                        <a
                          href={`https://wa.me/57${String(
                            appointment.userPhone
                          )}?text=${encodeURIComponent(
                            `Hola ${appointment.userName}! Te recordamos tu cita:\n` +
                              `📅 ${fmtDateLargo(appointment.date)}\n` +
                              `⏰ ${fmtTime(appointment.start)}\n` +
                              `💈 ${appointment.serviceName}\n` +
                              `Barbero: ${getBarberName(
                                String(appointment.barberId)
                              )}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-400"
                          title="WhatsApp"
                        >
                          💬
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dialog de reprogramación */}
      {rescheduleAppointment && (
        <RescheduleDialog
          appointment={rescheduleAppointment}
          onClose={() => setRescheduleAppointment(null)}
          onSuccess={() => {
            setRescheduleAppointment(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
