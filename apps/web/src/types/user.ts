import type { Role } from "@/lib/roles";

export type UserDoc = {
  displayName: string | null;
  nickname?: string | null;
  phone?: string | null;
  photoURL: string | null;
  role: Role;
  createdAt: number; // Date.now()
};
