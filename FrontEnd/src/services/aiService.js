import axiosInstance from "../api/axiosInstance";

const aiService = {

  chat: async (messageData) => {
    const response = await axiosInstance.post(
      "/api/ai/chat",
      messageData
    );

    return response.data;
  },

};

export default aiService;