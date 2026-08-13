import axiosInstance from "../api/axiosInstance";

const sustainabilityService = {

  // =========================================================
  // PRACTICE LOGS
  // =========================================================

  getMyPractices: async () => {
    const response = await axiosInstance.get(
      "/api/sustainability/practices"
    );

    return response.data;
  },

  createPractice: async (practiceData) => {
    const response = await axiosInstance.post(
      "/api/sustainability/practices",
      practiceData
    );

    return response.data;
  },

  getPractice: async (practiceId) => {
    const response = await axiosInstance.get(
      `/api/sustainability/practices/${practiceId}`
    );

    return response.data;
  },

  // =========================================================
  // METRICS
  // =========================================================

  getMetrics: async () => {
    const response = await axiosInstance.get(
      "/api/sustainability/metrics"
    );

    return response.data;
  },

  createMetric: async (metricData) => {
    const response = await axiosInstance.post(
      "/api/sustainability/metrics",
      metricData
    );

    return response.data;
  },

  // =========================================================
  // LEADERBOARD
  // =========================================================

  getLeaderboard: async (period = "ALL", state = null) => {

    const params = {
      period,
    };

    if (state) {
      params.state = state;
    }

    const response = await axiosInstance.get(
      "/api/sustainability/leaderboard",
      {
        params,
      }
    );

    return response.data;
  },

};

export default sustainabilityService;