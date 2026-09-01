
import { create } from "zustand";
import api from "../lib/axios";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,
  isRestoring: true,

  login: async (credentials) => {
    set({ loading: true, isRestoring: false });

    try {
      const response = await api.post("/users/login", credentials);

      const user = response.data.data.user;

      set({
        user,
        isAuthenticated: true,
        loading: false,
        isRestoring: false,
      });

      return user;
    } catch (error) {
      set({
        loading: false,
        user: null,
        isAuthenticated: false,
        isRestoring: false,
      });

      throw error;
    }
  },

  getCurrentUser: async () => {
    set({ loading: true, isRestoring: true });

    try {
      const response = await api.get("/users/me");

      const user = response.data.data;

      set({
        user,
        isAuthenticated: true,
        loading: false,
        isRestoring: false,
      });

      return user;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        isRestoring: false,
      });

      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post("/users/logout");
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));

export default useAuthStore;

