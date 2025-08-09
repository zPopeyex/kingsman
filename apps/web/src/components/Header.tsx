import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { hasPermission } from "@/lib/checkPermission";

export function Header() {
  const { user, profile, loginWithGoogle, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#0B0B0B]/80 backdrop-blur border-b border-white/5">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        {/* Brand con logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#D4AF37]/40 shadow-[0_0_0_2px_rgba(212,175,55,.18)]">
            <img
              src="/logo-kingsman.webp"
              alt="Kingsman Barber"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-serif text-[18px] tracking-wide text-[#D4AF37]">
            Kingsman Barber
          </span>
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-neutral-300 hover:text-[#D4AF37] transition"
          >
            Inicio
          </Link>
          <Link
            to="/citas"
            className="text-sm text-neutral-300 hover:text-[#D4AF37] transition"
          >
            Agendar Cita
          </Link>
          <Link
            to="/trabajos"
            className="text-sm text-neutral-300 hover:text-[#D4AF37] transition"
          >
            Trabajos
          </Link>
          {/* Panel admin visible solo con permiso */}
          {hasPermission(profile, "admin_panel") && (
            <Link
              to="/admin"
              className="text-sm text-neutral-300 hover:text-[#D4AF37] transition"
            >
              Panel Admin
            </Link>
          )}
        </nav>

        {/* Login / Usuario */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <div className="flex items-center gap-2 max-w-[200px]">
                <img
                  src={
                    user.photoURL ??
                    `https://api.dicebear.com/8.x/initials/svg?seed=${
                      profile?.nickname ?? "User"
                    }`
                  }
                  alt="avatar"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-neutral-700 object-cover"
                />
                <span className="text-sm text-neutral-200 truncate">
                  {user.displayName ?? profile?.nickname ?? "Usuario"}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition"
              >
                Salir
              </button>
            </>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="text-sm px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black hover:bg-[#F4D061] transition"
            >
              Entrar con Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
