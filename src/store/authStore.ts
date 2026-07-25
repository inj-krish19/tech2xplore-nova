import { create } from "zustand";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  image?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  status: "authenticated" | "unauthenticated" | "loading";
  setUser: (user: AuthUser | null) => void;
  setStatus: (status: AuthState["status"]) => void;
  clear: () => void;
}

/**
 * This store is NOT the source of truth for auth — Auth.js's server-side
 * session is. This just mirrors it into client state (via a
 * `<SessionSync>` component calling setUser from useSession) so components
 * can read the current user without a useSession() call + re-render on
 * every route. Never write to this store to "log a user in" — only ever
 * sync it from a real session.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
  clear: () => set({ user: null, status: "unauthenticated" }),
}));