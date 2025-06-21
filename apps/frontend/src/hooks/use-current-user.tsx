"use client";

// @ts-ignore
import { create } from "zustand";
// @ts-ignore
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  id: number | undefined;
  firstname: string;
  lastname: string;
  email: string;
};

export interface UserActions {
  user: User | undefined;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserActions>()(
  persist(
    (set: any) => ({
      user: undefined,
      setUser: (user: User) => {
        set({ user });
      },
      logout: () => {
        set({ user: undefined });
      },
    }),
    {
      name: "User",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
