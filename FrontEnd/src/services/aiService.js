import axiosInstance from "../api/axiosInstance";

const aiService = {

  chat: async (
    message
  ) => {

    const response =
      await axiosInstance.post(
        "/api/ai/chat",
        {
          message,
        }
      );

    return response.data;
  },

  getRecommendation: async (
    data
  ) => {

    const response =
      await axiosInstance.post(
        "/api/ai/recommendations",
        data
      );

    return response.data;
  },

  getMlRecommendation: async () => {
    const response = await axiosInstance.get("/api/ai/ml-recommendation");
    return response.data;
  },
};

export default aiService;