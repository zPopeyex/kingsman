// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Badge from "@/components/ui/Badge";

// Icono lápiz inline (sin libs externas)
function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.33H5v-.92L14.06 7.52l.92.92L5.92 19.58zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      />
    </svg>
  );
}

export default function Profile() {
  const { user, logout, role } = useAuth(); // ← ahora trae 'role' y 'logout'
  const navigate = useNavigate();

  const [nickname, setNickname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as any;
        setNickname(data?.nickname ?? user.displayName ?? "");
        setPhone(data?.phone ?? "");
      } else {
        setNickname(user.displayName ?? "");
      }
    };
    load();
  }, [user]);

  const handleSavePhone = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { phone });
      setEditingPhone(false);
    } catch (err) {
      console.error("Error updating phone:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      // Siempre volver a Inicio
      navigate("/", { replace: true });
    }
  };

  if (!user) return null;

  const roleLabel =
    role === "admin"
      ? "Administrador"
      : role === "dev"
      ? "Desarrollador"
      : "Cliente";

  return (
    <div className="max-w-md mx-auto px-4 py-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Perfil</h1>

      {/* Foto + nombre + email + badge de rol */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <img
          src={
            user.photoURL ??
            `https://api.dicebear.com/8.x/initials/svg?seed=${
              nickname || "User"
            }`
          }
          alt="Foto de perfil"
          className="w-24 h-24 rounded-full object-cover border border-neutral-700"
          referrerPolicy="no-referrer"
        />
        <div className="text-center">
          <p className="text-lg font-semibold">{nickname || "Usuario"}</p>
          {user.email ? (
            <p className="text-sm text-neutral-400">{user.email}</p>
          ) : null}
          <div className="mt-2">
            <Badge aria-label={`Rol del usuario: ${roleLabel}`}>
              {roleLabel}
            </Badge>
          </div>
        </div>
      </div>

      {/* WhatsApp (phone) con lápiz para editar */}
      <div className="mb-4">
        <label className="block text-sm text-neutral-400 mb-1">WhatsApp</label>

        {!editingPhone ? (
          <div className="flex items-center justify-between bg-neutral-800 rounded-lg px-3 py-2">
            <span>{phone || "Sin número"}</span>
            <button
              type="button"
              onClick={() => setEditingPhone(true)}
              className="p-1 rounded hover:bg-neutral-700 text-[#D4AF37]"
              aria-label="Editar número"
              title="Editar número"
            >
              <PencilIcon />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ingresa tu número"
              className="flex-1 bg-neutral-800 rounded-lg px-3 py-2 border border-neutral-600 focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="button"
              onClick={handleSavePhone}
              disabled={saving}
              className="px-3 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#F4D061] transition disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}
      </div>

      {/* Cerrar sesión: AHORA en todas las vistas (desktop y mobile) */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full mt-6 px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
