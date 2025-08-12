import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { db, auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Email sintético desde apodo
function emailFromNick(nick: string) {
  const safe = nick
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "");
  return `${safe}@kingsman.local`;
}

export default function LoginScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      if (!nickname || nickname.trim().length < 2)
        throw new Error("Apodo muy corto");
      if (password.length < 6)
        throw new Error("Contraseña mínimo 6 caracteres");

      const email = emailFromNick(nickname);

      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const ref = doc(db, "users", cred.user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            displayName: nickname,
            nickname,
            phone: phone || null,
            photoURL: cred.user.photoURL ?? null,
            role: "client",
            permissions: ["view_home", "book_appointment", "view_works"],
            createdAt: Date.now(),
            createdAtServer: serverTimestamp(),
          });
        }
        setMsg("Cuenta creada. ¡Bienvenido!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      setMsg(err.message || "Error de autenticación");
    } finally {
      setBusy(false);
    }
  };

  return (
    // Centro perfecto en toda la pantalla
    <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center px-4">
      {/* Columna centrada y con ancho máximo */}
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Medallón dorado (proporcional en todas las pantallas) */}
        <div className="w-[clamp(200px,32vw,350px)] aspect-square relative">
          {/* Aro dorado */}
          <div className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-br from-[#F4D061] via-[#D4AF37] to-[#8A6A12]">
            <div className="w-full h-full rounded-full bg-[#0B0B0B] overflow-hidden flex items-center justify-center">
              <img
                src="/kingsman_logo_transparent.webp"
                alt="Kingsman Barber"
                className="w-[100%] h-[100%] object-contain"
              />
            </div>
          </div>
          {/* Glow sutil */}
          <div
            aria-hidden
            className="absolute -inset-3 rounded-full bg-[#D4AF37]/22 blur-2xl"
          />
        </div>

        {/* Marca y subtítulo */}
        <div className="text-center mt-3">
          <h1 className="font-serif text-[22px] md:text-[26px] text-[#D4AF37]">
            Kingsman Barber
          </h1>
          <p className="text-neutral-300 mt-1">
            Reserva tu turno fácil y rápido
          </p>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-[#121212] border border-[#1F1F1F] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] p-5 md:p-6 w-full mt-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1 text-neutral-300">
                Apodo
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full h-12 rounded-xl bg-[#0B0B0B] border border-[#2a2a2a] px-3 outline-none focus:border-[#D4AF37] placeholder:text-neutral-500/85"
                placeholder="ej: Leo"
                autoFocus
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm mb-1 text-neutral-300">
                  WhatsApp (opcional)
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 rounded-xl bg-[#0B0B0B] border border-[#2a2a2a] px-3 outline-none focus:border-[#D4AF37] placeholder:text-neutral-500/85"
                  placeholder="+57 3000000000"
                />
              </div>
            )}

            <div>
              <label className="block text-sm mb-1 text-neutral-300">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-xl bg-[#0B0B0B] border border-[#2a2a2a] px-3 outline-none focus:border-[#D4AF37] placeholder:text-neutral-500/85"
                placeholder="mínimo 6 caracteres"
              />
            </div>

            {msg && <div className="text-sm text-red-400">{msg}</div>}

            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 rounded-xl bg-[#D4AF37] text-black hover:bg-[#F4D061] transition font-medium"
            >
              {mode === "signup" ? "Crear cuenta" : "Ingresar"}
            </button>
          </form>

          {/* Botón Google debajo del form */}
          <button
            onClick={async () => {
              try {
                await loginWithGoogle();
                navigate("/", { replace: true }); // siempre redirige al inicio
              } catch (err) {
                console.error(err);
              }
            }}
            disabled={busy}
            className="mt-4 w-full h-11 rounded-xl border border-neutral-700 bg-white text-black hover:opacity-90 transition flex items-center justify-center gap-3"
          >
            {/* Logo Google */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
              aria-hidden
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.885 32.449 29.34 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C33.871 6.053 29.169 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.816C14.66 16.107 18.961 14 24 14c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C33.871 6.053 29.169 4 24 4c-7.797 0-14.426 4.433-17.694 10.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.257 0 10.058-2.01 13.675-5.292l-6.315-5.341C29.295 34.484 26.787 35.5 24 35.5 18.679 35.5 14.147 31.99 12.71 27.084l-6.49 5.004C8.487 39.304 15.15 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-1.618 4.449-6.163 8-11.303 8-5.321 0-9.853-3.51-11.29-8.416l-6.49 5.004C8.487 39.304 15.15 44 24 44c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"
              />
            </svg>
            <span className="font-medium">Continuar con Google</span>
          </button>

          {/* Toggle login/registro */}
          <div className="text-center text-sm text-neutral-400 mt-4">
            {mode === "signup" ? (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  className="text-[#F4D061]"
                  onClick={() => setMode("login")}
                >
                  Inicia sesión
                </button>
              </>
            ) : (
              <>
                ¿Aún no tienes cuenta?{" "}
                <button
                  className="text-[#F4D061]"
                  onClick={() => setMode("signup")}
                >
                  Regístrate
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
