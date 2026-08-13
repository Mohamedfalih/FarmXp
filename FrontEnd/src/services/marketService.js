import axiosInstance from "../api/axiosInstance";

const marketService = {

  // ==========================================================
  // BUYERS
  // ==========================================================

  getBuyers: async () => {

    const response =
      await axiosInstance.get(
        "/api/market/buyers"
      );

    return response.data;
  },

  getActiveBuyers: async () => {

    const response =
      await axiosInstance.get(
        "/api/market/buyers/active"
      );

    return response.data;
  },

  getBuyer: async (
    buyerId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/market/buyers/${buyerId}`
      );

    return response.data;
  },

  // ==========================================================
  // INQUIRIES
  // ==========================================================

  sendBuyerInquiry: async (
    inquiryData
  ) => {

    const response =
      await axiosInstance.post(
        "/api/market/inquiries",
        inquiryData
      );

    return response.data;
  },

  getMyInquiries: async () => {

    const response =
      await axiosInstance.get(
        "/api/market/inquiries/my"
      );

    return response.data;
  },

  getInquiry: async (
    inquiryId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/market/inquiries/${inquiryId}`
      );

    return response.data;
  },

  // ==========================================================
  // MATCHES
  // ==========================================================

  getMatches: async () => {

    const response =
      await axiosInstance.get(
        "/api/market/matches"
      );

    return response.data;
  },

  getFarmerMatches: async (
    farmerId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/market/matches/farmer/${farmerId}`
      );

    return response.data;
  },

  getMatch: async (
    matchId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/market/matches/${matchId}`
      );

    return response.data;
  },

  createMatch: async (
    matchData
  ) => {

    const response =
      await axiosInstance.post(
        "/api/market/matches",
        matchData
      );

    return response.data;
  },

  updateMatchStatus: async (
    matchId,
    statusData
  ) => {

    const response =
      await axiosInstance.patch(
        `/api/market/matches/${matchId}/status`,
        statusData
      );

    return response.data;
  },
};

export default marketService;