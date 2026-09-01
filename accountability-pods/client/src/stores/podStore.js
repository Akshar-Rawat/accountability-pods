import { create } from "zustand";
import api from "../lib/axios";

const usePodStore = create((set, get) => ({
  pods: [],
  currentPod: null,
  podStreaks: [],
  myCurrentStreak: null,
  podStreaksCache: {},
  todaysCheckIns: [],
  loading: false,
  checkInLoading: false,
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

  joinPod: async (inviteCode) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/pods/join/${inviteCode}`);
      const pod = response.data.data;
      set((state) => ({
        pods: [...state.pods, pod],
        loading: false,
      }));
      return pod;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to join pod",
        loading: false,
      });
      throw error;
    }
  },

  leavePod: async (podId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/pods/${podId}/leave`);
      set((state) => ({
        pods: state.pods.filter(p => p._id !== podId),
        currentPod: null,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to leave pod",
        loading: false,
      });
      throw error;
    }
  },

  clearCurrentPod: () => {
    set({
      currentPod: null,
      podStreaks: [],
      myCurrentStreak: null,
      todaysCheckIns: [],
      error: null,
    });
  },

  getPodStreaks: async (podId) => {
    try {
      const response = await api.get(`/pods/${podId}/streaks`);
      set({ podStreaks: response.data.data });
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch pod streaks:", error);
    }
  },

  getPodStreak: async (podId) => {
    try {
      const response = await api.get(`/pods/${podId}/streak`);
      set((state) => ({ 
        myCurrentStreak: response.data.data,
        podStreaksCache: {
          ...state.podStreaksCache,
          [podId]: response.data.data.currentStreak
        }
      }));
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 404) {
        set((state) => ({ 
          myCurrentStreak: { currentStreak: 0, longestStreak: 0 },
          podStreaksCache: {
            ...state.podStreaksCache,
            [podId]: 0
          }
        }));
      } else {
        console.error("Failed to fetch my streak:", error);
      }
    }
  },

  fetchStreakForPod: async (podId) => {
    // A lighter action specifically for the pods list to populate the cache
    if (get().podStreaksCache[podId] !== undefined) return;
    try {
      const response = await api.get(`/pods/${podId}/streak`);
      set((state) => ({
        podStreaksCache: {
          ...state.podStreaksCache,
          [podId]: response.data.data.currentStreak
        }
      }));
    } catch (error) {
      if (error.response?.status === 404) {
        set((state) => ({
          podStreaksCache: {
            ...state.podStreaksCache,
            [podId]: 0
          }
        }));
      }
    }
  },

  getTodaysCheckIns: async (podId) => {
    try {
      const response = await api.get(`/pods/${podId}/checkins`);
      set({ todaysCheckIns: response.data.data });
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch todays checkins:", error);
    }
  },

  checkIn: async (podId, note = "", photoUrl = "") => {
    set({ checkInLoading: true, error: null });
    try {
      const response = await api.post(`/pods/${podId}/checkins`, { note, photoUrl });
      
      const { checkIn, streak } = response.data.data;

      set((state) => ({
        todaysCheckIns: [...state.todaysCheckIns, checkIn],
        myCurrentStreak: streak,
        checkInLoading: false,
      }));
      
      // refresh leaderboard
      get().getPodStreaks(podId);

      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to check in",
        checkInLoading: false,
      });
      throw error;
    }
  },
}));

export default usePodStore;