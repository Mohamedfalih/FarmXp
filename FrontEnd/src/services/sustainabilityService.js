import axiosInstance from "../api/axiosInstance";

const sustainabilityService = {

  // ==========================================================
  // PRACTICES
  // ==========================================================

  getMyPractices: async () => {

    const response =
      await axiosInstance.get(
        "/api/sustainability/practices"
      );

    return response.data;
  },

  createPractice: async (
    practiceData
  ) => {

    const response =
      await axiosInstance.post(
        "/api/sustainability/practices",
        practiceData
      );

    return response.data;
  },

  getPractice: async (
    practiceId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/sustainability/practices/${practiceId}`
      );

    return response.data;
  },

  // ==========================================================
  // METRICS
  // ==========================================================

  getMetrics: async () => {

    const response =
      await axiosInstance.get(
        "/api/sustainability/metrics"
      );

    return response.data;
  },

  getMetric: async (
    metricId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/sustainability/metrics/${metricId}`
      );

    return response.data;
  },

  createMetric: async (
    metricData
  ) => {

    const response =
      await axiosInstance.post(
        "/api/sustainability/metrics",
        metricData
      );

    return response.data;
  },

  // ==========================================================
  // SCORE
  // ==========================================================

  getScore: async () => {

    const response =
      await axiosInstance.get(
        "/api/sustainability/score"
      );

    return response.data;
  },

  // ==========================================================
  // LEADERBOARD
  // ==========================================================

  getLeaderboard: async (
    period = "ALL",
    state = null
  ) => {

    const params = {
      period,
    };

    if (state) {
      params.state = state;
    }

    const response =
      await axiosInstance.get(
        "/api/sustainability/leaderboard",
        {
          params,
        }
      );

    return response.data;
  },

  // ==========================================================
  // ADMIN VERIFICATION
  // ==========================================================

  getPendingPractices: async () => {

    const response =
      await axiosInstance.get(
        "/api/sustainability/verification/pending"
      );

    return response.data;
  },

  getPracticesByStatus: async (
    status
  ) => {

    const response =
      await axiosInstance.get(
        "/api/sustainability/verification",
        {
          params: {
            status,
          },
        }
      );

    return response.data;
  },

  verifyPractice: async (
    practiceId,
    verificationData
  ) => {

    const response =
      await axiosInstance.put(
        `/api/sustainability/verification/${practiceId}`,
        verificationData
      );

    return response.data;
  },
};

export default sustainabilityService;