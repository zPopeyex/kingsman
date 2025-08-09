import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db, googleProvider } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth"; // ✅ tipo, no valor
import { doc, getDoc, setDoc } from "firebase/firestore";
import { DEFAULT_ROLE } from "@/lib/roles";
import type { UserDoc } from "@/types/user";

type AuthState = {
  user: FirebaseUser | null;
  profile: UserDoc | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }
      // crea/lee user doc
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        const payload: UserDoc = {
          displayName: u.displayName,
          nickname: u.displayName,
          phone: null,
          photoURL: u.photoURL,
          role: "client",
          createdAt: Date.now(),
        };
        await setDoc(ref, payload);
        setProfile(payload);
      } else {
        setProfile(snap.data() as UserDoc);
      }
      setLoading(false);
    });
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo(() => ({ user, profile, loading, loginWithGoogle, logout }), [user, profile, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
