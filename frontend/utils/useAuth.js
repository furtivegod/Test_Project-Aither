import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (newToken) => set({ token: newToken }),
      refreshToken: null,
      setRefreshToken: (newRefreshToken) =>
        set({ refreshToken: newRefreshToken }),
      setUser: (newUser) => set({ user: newUser }),
      removeAuth: () => set({ token: null, refreshToken: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
