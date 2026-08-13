import axiosInstance from "../api/axiosInstance";

const schemeService = {

  getSchemes: async () => {
    const response = await axiosInstance.get(
      "/api/schemes"
    );

    return response.data;
  },

  getScheme: async (schemeId) => {
    const response = await axiosInstance.get(
      `/api/schemes/${schemeId}`
    );

    return response.data;
  },

};

export default schemeService;