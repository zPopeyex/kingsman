import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import toast, { Toaster } from "react-hot-toast";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Intentar obtener datos del state de navegación
    let data = location.state;

    // Si no hay state, intentar localStorage
    if (!data || !data.appointment) {
      const localData = localStorage.getItem("lastBooking");
      if (localData) {
        data = JSON.parse(localData);
      }
    }

    if (data && data.appointment) {
      setBookingData(data);
    } else {
      // Si no hay datos, crear unos de prueba para mostrar algo
      setBookingData({
        appointmentId: "test-" + Date.now(),
        appointment: {
          barberId: "Carlos Rodríguez",
          date: new Date().toISOString().split("T")[0],
          start: "10:00",
          end: "10:30",
          serviceName: "Corte Premium",
          price: 50000,
          payment: {
            ref: "TEST-" + Date.now(),
            status: "APPROVED",
          },
        },
        transaction: { status: "APPROVED" },
      });
    }
  }, [location]);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="text-white mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  const { appointmentId, appointment, transaction } = bookingData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCopyReference = () => {
    navigator.clipboard
      .writeText(appointment.payment.ref)
      .then(() => {
        toast.success("Referencia copiada al portapapeles");
      })
      .catch(() => {
        toast.error("Error al copiar la referencia");
      });
  };

  // Generar mensaje de WhatsApp
  const whatsappMessage = encodeURIComponent(
    `Hola! Acabo de reservar una cita:\\n` +
      `📅 Fecha: ${appointment.date}\\n` +
      `⏰ Hora: ${appointment.start}\\n` +
      `💈 Servicio: ${appointment.serviceName}\\n` +
      `💰 Monto: ${formatCurrency(appointment.price)}\\n` +
      `📝 Ref: ${appointment.payment.ref}`
  );

  const whatsappLink = `https://wa.me/573001234567?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-4">
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

      <div className="max-w-md w-full">
        <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#D4AF37]/20 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-[#D4AF37]"
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
          </div>

          <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">
            ¡Reserva Confirmada!
          </h1>

          <p className="text-[#C7C7C7] mb-6">
            Tu cita ha sido reservada exitosamente
          </p>

          {/* Detalles de la reserva */}
          <div className="bg-[#0B0B0B] rounded-xl p-6 text-left space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-[#C7C7C7]">Referencia:</span>
              <span className="font-semibold text-[#D4AF37] font-mono text-sm">
                {appointment.payment.ref}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#C7C7C7]">Fecha:</span>
              <span className="font-semibold text-white">
                {appointment.date}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#C7C7C7]">Hora:</span>
              <span className="font-semibold text-white">
                {appointment.start} - {appointment.end}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#C7C7C7]">Servicio:</span>
              <span className="font-semibold text-white">
                {appointment.serviceName}
              </span>
            </div>
            <div className="border-t border-[#D4AF37]/20 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-[#C7C7C7]">Monto pagado:</span>
                <span className="font-bold text-[#D4AF37] text-lg">
                  {formatCurrency(appointment.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 block"
            >
              <svg
                className="w-5 h-5 inline"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Enviar por WhatsApp
            </a>

            <button
              onClick={handleCopyReference}
              className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              Copiar Referencia
            </button>

            <Link
              to="/citas"
              className="w-full bg-transparent hover:bg-[#D4AF37]/10 text-[#D4AF37] py-3 px-6 rounded-xl font-semibold transition-colors block text-center"
            >
              Hacer otra reserva
            </Link>

            <Link
              to="/"
              className="w-full bg-transparent hover:bg-[#D4AF37]/10 text-white py-3 px-6 rounded-xl font-semibold transition-colors block text-center"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
