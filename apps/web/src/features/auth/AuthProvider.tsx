import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase"; // <-- tu auth inicializado
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { UserDoc } from "@/types/user";

type AuthState = {
  user: FirebaseUser | null;
  profile: UserDoc | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<UserDoc | null>>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // cargar/crear documento de usuario
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          const baseDoc: UserDoc = {
            displayName: u.displayName ?? "",
            nickname: u.displayName ?? "",
            photoURL: u.photoURL ?? "",

            createdAt: Date.now(), // o null si en el tipo es opcional
          };
          await setDoc(ref, baseDoc, { merge: true });
          setProfile(baseDoc);
        } else {
          setProfile(snap.data() as UserDoc);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // NO navegamos aquí; la UI decide a dónde ir
  };

  const logout = async () => {
    await signOut(auth);
    // NO uses useNavigate aquí — la redirección la hace el componente (p.ej., Profile)
  };

  const value: AuthState = {
    user,
    profile,
    loading,
    loginWithGoogle,
    logout,
    setProfile,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
