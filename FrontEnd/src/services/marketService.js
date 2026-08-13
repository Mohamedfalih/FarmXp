import axiosInstance from "../api/axiosInstance";

const marketService = {

  // =========================================================
  // BUYERS
  // =========================================================

  getBuyers: async () => {
    const response = await axiosInstance.get(
      "/api/market/buyers"
    );

    return response.data;
  },

  getBuyer: async (buyerId) => {
    const response = await axiosInstance.get(
      `/api/market/buyers/${buyerId}`
    );

    return response.data;
  },

  // =========================================================
  // MARKET MATCHES
  // =========================================================

  getMatches: async () => {
    const response = await axiosInstance.get(
      "/api/market/matches"
    );

    return response.data;
  },

  createMatch: async (matchData) => {
    const response = await axiosInstance.post(
      "/api/market/matches",
      matchData
    );

    return response.data;
  },

  updateMatchStatus: async (matchId, statusData) => {
    const response = await axiosInstance.patch(
      `/api/market/matches/${matchId}/status`,
      statusData
    );

    return response.data;
  },

};

export default marketService;