import { Link } from "react-router-dom";
export default function Booking() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Agendar cita</h2>
      <p className="text-neutral-400">
        Aquí irá el calendario y los horarios disponibles.
      </p>
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-4xl md:text-6xl text-[#D4AF37] mb-6">
          Kingsman Barber
        </h1>
        <Link
          to="/citas"
          className="inline-flex items-center rounded-2xl px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#F4D061] transition shadow"
        >
          Reservar
        </Link>
      </section>
    </div>
  );
}
