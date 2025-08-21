import React, { useState, useEffect } from "react";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import { getAppointmentsByDateRange } from "@/services/appointments";
import { getActiveBarbers } from "@/services/barbers";
import type { Appointment, Barber } from "@/types/booking";

type DateRange = "today" | "week" | "month";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0,
    rescheduledAppointments: 0, // NUEVO
    totalRevenue: 0,
    averageTicket: 0,
    occupancyRate: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (dateRange) {
        case "today":
          startDate = startOfDay(now);
          endDate = endOfDay(now);
          break;
        case "week":
          startDate = startOfWeek(now, { locale: es });
          endDate = endOfWeek(now, { locale: es });
          break;
        case "month":
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
      }

      const [appointmentsData, barbersData] = await Promise.all([
        getAppointmentsByDateRange(
          format(startDate, "yyyy-MM-dd"),
          format(endDate, "yyyy-MM-dd")
        ),
        getActiveBarbers(),
      ]);

      setAppointments(appointmentsData);
      setBarbers(barbersData);
      calculateStats(appointmentsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointments: Appointment[]) => {
    const confirmed = appointments.filter(
      (a) => a.status === "confirmed"
    ).length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const cancelled = appointments.filter(
      (a) => a.status === "cancelled"
    ).length;
    const rescheduled = appointments.filter(
      (a) => a.status === "rescheduled"
    ).length; // NUEVO

    // Incluir reprogramadas en el revenue si tienen pago aprobado
    const revenue = appointments
      .filter(
        (a) =>
          (a.status === "confirmed" || a.status === "rescheduled") &&
          a.payment?.status === "APPROVED"
      )
      .reduce((sum, a) => sum + (a.price || 0), 0);

    const paidAppointments = appointments.filter(
      (a) =>
        (a.status === "confirmed" || a.status === "rescheduled") &&
        a.payment?.status === "APPROVED"
    ).length;

    const averageTicket = paidAppointments > 0 ? revenue / paidAppointments : 0;

    const totalSlots =
      barbers.length *
      16 *
      (dateRange === "today" ? 1 : dateRange === "week" ? 7 : 30);
    const occupiedSlots = confirmed + rescheduled; // Incluir reprogramadas
    const occupancyRate =
      totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0;

    setStats({
      totalAppointments: appointments.length,
      confirmedAppointments: confirmed,
      pendingAppointments: pending,
      cancelledAppointments: cancelled,
      rescheduledAppointments: rescheduled, // NUEVO
      totalRevenue: revenue,
      averageTicket,
      occupancyRate,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Citas",
      value: stats.totalAppointments,
      icon: "📅",
      color: "text-white",
      bgColor: "bg-[#1A1A1A]",
    },
    {
      title: "Confirmadas",
      value: stats.confirmedAppointments,
      icon: "✅",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pendientes",
      value: stats.pendingAppointments,
      icon: "⏳",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Reprogramadas", // NUEVA CARD
      value: stats.rescheduledAppointments,
      icon: "🔄",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Canceladas",
      value: stats.cancelledAppointments,
      icon: "❌",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Ingresos",
      value: formatCurrency(stats.totalRevenue),
      icon: "💰",
      color: "text-[#D4AF37]",
      bgColor: "bg-[#D4AF37]/10",
    },
    {
      title: "Ticket Promedio",
      value: formatCurrency(stats.averageTicket),
      icon: "🎯",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Ocupación",
      value: `${stats.occupancyRate.toFixed(1)}%`,
      icon: "📊",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Selector de período */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#D4AF37]">Dashboard</h2>
        <div className="flex gap-2">
          {(["today", "week", "month"] as DateRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all
                ${
                  dateRange === range
                    ? "bg-[#D4AF37] text-[#0B0B0B]"
                    : "bg-[#1A1A1A] text-[#C7C7C7] hover:text-white"
                }
              `}
            >
              {range === "today" ? "Hoy" : range === "week" ? "Semana" : "Mes"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-2xl p-6 border border-[#D4AF37]/10`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#C7C7C7] text-sm mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de citas por hora - INCLUIR REPROGRAMADAS */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
        <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
          Distribución de Citas por Hora
        </h3>
        <div className="space-y-3">
          {["09:00", "11:00", "14:00", "16:00", "18:00"].map((hour) => {
            // Incluir todas las citas activas (confirmadas y reprogramadas)
            const count = appointments.filter(
              (a) =>
                a.start?.startsWith(hour.substring(0, 2)) &&
                (a.status === "confirmed" ||
                  a.status === "rescheduled" ||
                  a.status === "pending")
            ).length;

            const activeAppointments = appointments.filter(
              (a) =>
                a.status === "confirmed" ||
                a.status === "rescheduled" ||
                a.status === "pending"
            ).length;

            const percentage =
              activeAppointments > 0 ? (count / activeAppointments) * 100 : 0;

            return (
              <div key={hour} className="flex items-center gap-4">
                <span className="text-[#C7C7C7] text-sm w-12">{hour}</span>
                <div className="flex-1 bg-[#0B0B0B] rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F4D061] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[#C7C7C7] text-sm w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resto del componente igual... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
          <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
            Servicios Más Solicitados
          </h3>
          <div className="space-y-3">
            {["Corte Premium", "Barba", "Combo Completo"].map(
              (service, index) => {
                const count = appointments.filter(
                  (a) =>
                    a.serviceName?.includes(service) &&
                    (a.status === "confirmed" || a.status === "rescheduled")
                ).length;

                return (
                  <div
                    key={service}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                      <span className="text-white">{service}</span>
                    </div>
                    <span className="text-[#D4AF37] font-bold">{count}</span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
          <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
            Performance por Barbero
          </h3>
          <div className="space-y-3">
            {barbers.slice(0, 3).map((barber) => {
              const barberAppointments = appointments.filter(
                (a) =>
                  a.barberId === barber.id &&
                  (a.status === "confirmed" || a.status === "rescheduled")
              );
              const revenue = barberAppointments
                .filter((a) => a.payment?.status === "APPROVED")
                .reduce((sum, a) => sum + (a.price || 0), 0);

              return (
                <div
                  key={barber.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{barber.avatar || "💈"}</span>
                    <div>
                      <p className="text-white font-medium">
                        {barber.displayName}
                      </p>
                      <p className="text-xs text-[#C7C7C7]">
                        {barberAppointments.length} citas
                      </p>
                    </div>
                  </div>
                  <span className="text-[#D4AF37] font-bold">
                    {formatCurrency(revenue)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
