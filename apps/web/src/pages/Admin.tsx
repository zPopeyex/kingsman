import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/features/auth/AuthProvider";
import ScheduleEditor from "@/components/admin/ScheduleEditor";
import AppointmentsTable from "@/components/admin/AppointmentsTable";
import AdminDashboard from "@/components/admin/AdminDashboard";
import BarberManagement from "@/components/admin/BarberManagement";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type TabType = "dashboard" | "appointments" | "schedules" | "barbers";

/** ==== Helpers para fechas (útiles si en tablas llegan Timestamps) ==== */
export const toDateSafe = (v: any): Date | null => {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (v instanceof Timestamp) return v.toDate();
  const d = new Date(v); // intenta con ISO/epoch
  return isNaN(d.getTime()) ? null : d;
};

export const fmtFecha = (v: any, fmt = "d/M/yyyy") =>
  toDateSafe(v) ? format(toDateSafe(v)!, fmt, { locale: es }) : "";

export const fmtHora = (v: any, fmt = "hh:mm a") =>
  toDateSafe(v) ? format(toDateSafe(v)!, fmt, { locale: es }) : "";

/** ==== Error Boundary para evitar que un objeto en <td> tumbe toda la UI ==== */
class AdminErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; details?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true, details: String(err?.message || err) };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-[#1A1A1A] border border-red-800/40 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-red-400 mb-2">
              Ocurrió un error al mostrar la tabla.
            </h2>
            <p className="text-sm text-[#C7C7C7] mb-3">
              Usualmente pasa cuando se intenta renderizar un objeto (p. ej.{" "}
              <code>Timestamp</code> de Firestore) directamente dentro de una
              celda. La página sigue funcionando; corrige ese dato formateándolo
              a texto.
            </p>
            <pre className="text-xs text-[#C7C7C7] bg-black/30 p-3 rounded overflow-x-auto">
              {this.state.details}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [loading, setLoading] = useState(true);

  // Verificar permisos de admin (placeholder: permite a todos durante desarrollo)
  const checkAdminAccess = useCallback(() => {
    // Si tu AuthProvider expone "undefined" mientras carga, esta línea evita navegar antes de tiempo.
    // Si no lo usa, puedes quitarla sin problema.
    // @ts-ignore
    if (user === undefined) return;

    if (!user) {
      navigate("/");
      return;
    }
    // Aquí podrías validar user.role === 'admin'
    setLoading(false);
  }, [navigate, user]);

  useEffect(() => {
    let mounted = true;
    if (!mounted) return;
    checkAdminAccess();
    return () => {
      mounted = false;
    };
  }, [checkAdminAccess]);

  const tabs = useMemo(
    () => [
      { id: "dashboard" as TabType, label: "Dashboard", icon: "📊" },
      { id: "appointments" as TabType, label: "Citas", icon: "📅" },
      { id: "schedules" as TabType, label: "Horarios", icon: "⏰" },
      { id: "barbers" as TabType, label: "Barberos", icon: "✂️" },
    ],
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
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

      {/* Header — padding top para no quedar debajo de un navbar fijo global */}
      <header className="bg-[#1A1A1A] border-b border-[#D4AF37]/20 pt-24">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#D4AF37]">
                Panel de Administración
              </h1>
              <p className="text-[#C7C7C7] text-sm mt-1">
                Gestiona citas, horarios y barberos
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-xl transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-[#1A1A1A]/50 border-b border-[#D4AF37]/10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#D4AF37] border-[#D4AF37]"
                    : "text-[#C7C7C7] border-transparent hover:text-white"
                }`}
              >
                <span aria-hidden>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content (protegido por ErrorBoundary) */}
      <AdminErrorBoundary>
        <main className="container mx-auto px-4 py-8">
          {activeTab === "dashboard" && <AdminDashboard />}

          {activeTab === "appointments" && (
            // AppointmentsTable sigue igual; si internamente hay Timestamps sin formatear,
            // el ErrorBoundary evitará que la UI se caiga.
            <AppointmentsTable />
          )}

          {activeTab === "schedules" && <ScheduleEditor />}

          {activeTab === "barbers" && <BarberManagement />}
        </main>
      </AdminErrorBoundary>
    </div>
  );
}
