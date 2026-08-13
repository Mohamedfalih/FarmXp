import axiosInstance from "../api/axiosInstance";

const schemeService = {

  getSchemes: async () => {

    const response =
      await axiosInstance.get(
        "/api/schemes"
      );

    return response.data;
  },

  getAllSchemes: async () => {

    const response =
      await axiosInstance.get(
        "/api/schemes/all"
      );

    return response.data;
  },

  getScheme: async (
    schemeId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/schemes/${schemeId}`
      );

    return response.data;
  },

  getSchemeById: async (
    schemeId
  ) => {

    return schemeService.getScheme(
      schemeId
    );
  },

  getSchemesByState: async (
    state
  ) => {

    const response =
      await axiosInstance.get(
        `/api/schemes/state/${encodeURIComponent(state)}`
      );

    return response.data;
  },
};

export default schemeService;