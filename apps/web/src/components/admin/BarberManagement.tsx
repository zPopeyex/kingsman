import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getActiveBarbers, saveBarber } from "@/services/barbers";
import type { Barber } from "@/types/booking";

export default function BarberManagement() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    specialty: "",
    avatar: "💈",
    role: "client" as "admin" | "dev" | "client",
    active: true,
  });

  const avatarOptions = ["💈", "✂️", "👨‍🦱", "🧔", "👨", "👨‍🦰", "💇‍♂️", "🪒"];

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    setLoading(true);
    try {
      const data = await getActiveBarbers();
      setBarbers(data);
    } catch (error) {
      console.error("Error loading barbers:", error);
      toast.error("Error al cargar barberos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const barberData: Omit<Barber, "id"> = {
        ...formData,
        role: formData.role as "admin" | "dev" | "client",
      };

      if (editingBarber) {
        await saveBarber(barberData, editingBarber.id);
        toast.success("Barbero actualizado exitosamente");
      } else {
        await saveBarber(barberData);
        toast.success("Barbero creado exitosamente");
      }

      setShowForm(false);
      setEditingBarber(null);
      resetForm();
      loadBarbers();
    } catch (error) {
      console.error("Error saving barber:", error);
      toast.error("Error al guardar barbero");
    }
  };

  const handleEdit = (barber: Barber) => {
    setEditingBarber(barber);
    setFormData({
      displayName: barber.displayName,
      phone: barber.phone,
      specialty: barber.specialty || "",
      avatar: barber.avatar || "💈",
      role: barber.role,
      active: barber.active,
    });
    setShowForm(true);
  };

  const handleToggleActive = async (barber: Barber) => {
    try {
      await saveBarber({ ...barber, active: !barber.active }, barber.id);
      toast.success(`Barbero ${!barber.active ? "activado" : "desactivado"}`);
      loadBarbers();
    } catch (error) {
      console.error("Error toggling barber status:", error);
      toast.error("Error al cambiar estado");
    }
  };

  const resetForm = () => {
    setFormData({
      displayName: "",
      phone: "",
      specialty: "",
      avatar: "💈",
      role: "client",
      active: true,
    });
    setEditingBarber(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#D4AF37]">
          Gestión de Barberos
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            resetForm();
          }}
          className="bg-[#D4AF37] hover:bg-[#F4D061] text-[#0B0B0B] px-4 py-2 rounded-xl font-semibold transition-colors"
        >
          + Agregar Barbero
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
          <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
            {editingBarber ? "Editar Barbero" : "Nuevo Barbero"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#C7C7C7] mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#C7C7C7] mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  placeholder="3001234567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#C7C7C7] mb-2">
                  Especialidad
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  placeholder="Ej: Fade & Diseños"
                />
              </div>

              <div>
                <label className="block text-sm text-[#C7C7C7] mb-2">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "admin" | "dev" | "client",
                    })
                  }
                  className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-white focus:border-[#D4AF37]/50 focus:outline-none"
                >
                  <option value="client">Barbero</option>
                  <option value="dev">Desarrollador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            {/* Avatar selector */}
            <div>
              <label className="block text-sm text-[#C7C7C7] mb-2">
                Avatar
              </label>
              <div className="flex gap-2">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar })}
                    className={`
                      text-2xl p-2 rounded-lg border-2 transition-all
                      ${
                        formData.avatar === avatar
                          ? "border-[#D4AF37] bg-[#D4AF37]/20"
                          : "border-[#D4AF37]/20 hover:border-[#D4AF37]/50"
                      }
                    `}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Estado activo */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="w-4 h-4 text-[#D4AF37] bg-[#0B0B0B] border-[#D4AF37]/20 rounded focus:ring-[#D4AF37]"
              />
              <label htmlFor="active" className="text-white">
                Barbero activo
              </label>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex-1 bg-[#0B0B0B] hover:bg-[#1A1A1A] text-white px-4 py-2 rounded-xl font-semibold transition-colors border border-[#D4AF37]/20"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#D4AF37] hover:bg-[#F4D061] text-[#0B0B0B] px-4 py-2 rounded-xl font-semibold transition-colors"
              >
                {editingBarber ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de barberos */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#D4AF37]/10">
        <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
          Barberos Registrados ({barbers.length})
        </h3>

        {barbers.length === 0 ? (
          <p className="text-[#C7C7C7] text-center py-8">
            No hay barberos registrados
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className={`
                  bg-[#0B0B0B] rounded-xl p-4 border transition-all
                  ${
                    barber.active
                      ? "border-[#D4AF37]/20 hover:border-[#D4AF37]/50"
                      : "border-gray-600/20 opacity-60"
                  }
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{barber.avatar || "💈"}</span>
                    <div>
                      <h4 className="font-semibold text-white">
                        {barber.displayName}
                      </h4>
                      <p className="text-xs text-[#C7C7C7]">
                        {barber.specialty || "Barbero"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${
                      barber.role === "admin"
                        ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                        : barber.role === "dev"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-gray-500/20 text-gray-400"
                    }
                  `}
                  >
                    {barber.role === "admin"
                      ? "Admin"
                      : barber.role === "dev"
                      ? "Dev"
                      : "Barbero"}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-sm text-[#C7C7C7]">📱 {barber.phone}</p>
                  <p className="text-sm">
                    <span
                      className={`
                      inline-block w-2 h-2 rounded-full mr-2
                      ${barber.active ? "bg-green-500" : "bg-gray-500"}
                    `}
                    />
                    {barber.active ? "Activo" : "Inactivo"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(barber)}
                    className="flex-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(barber)}
                    className={`
                      flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${
                        barber.active
                          ? "bg-red-500/10 hover:bg-red-500/20 text-red-500"
                          : "bg-green-500/10 hover:bg-green-500/20 text-green-500"
                      }
                    `}
                  >
                    {barber.active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
