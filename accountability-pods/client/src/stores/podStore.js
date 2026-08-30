import { create } from "zustand";
import api from "../lib/axios";

const usePodStore = create((set) => ({
  pods: [],
  currentPod: null,
  loading: false,
  error: null,

  getMyPods: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("/pods/my-pods");

      set({
        pods: response.data.data,
        loading: false,
      });

      return response.data.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch pods",
        loading: false,
      });

      throw error;
    }
  },

  getPodById: async (podId) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/pods/${podId}`);

      set({
        currentPod: response.data.data,
        loading: false,
      });

      return response.data.data;
    } catch (error) {
      set({
        currentPod: null,
        error:
          error.response?.data?.message ||
          "Failed to fetch pod",
        loading: false,
      });

      throw error;
    }
  },

  createPod: async (podData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/pods", podData);

      const newPod = response.data.data;

      set((state) => ({
        pods: [...state.pods, newPod],
        loading: false,
      }));

      return newPod;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to create pod",
        loading: false,
      });

      throw error;
    }
  },

  clearCurrentPod: () => {
    set({
      currentPod: null,
      error: null,
    });
  },
}));

export default usePodStore;