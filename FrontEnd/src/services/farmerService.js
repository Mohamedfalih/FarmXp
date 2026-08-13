import axiosInstance from "../api/axiosInstance";

const farmerService = {

  // ==========================================================
  // PROFILE
  // ==========================================================

  getProfile: async () => {
    const response =
      await axiosInstance.get(
        "/api/farmers/profile"
      );

    return response.data;
  },

  createProfile: async (profileData) => {
    const response =
      await axiosInstance.post(
        "/api/farmers/profile",
        profileData
      );

    return response.data;
  },

  updateProfile: async (profileData) => {
    const response =
      await axiosInstance.put(
        "/api/farmers/profile",
        profileData
      );

    return response.data;
  },

  profileExists: async () => {
    const response =
      await axiosInstance.get(
        "/api/farmers/profile/exists"
      );

    return response.data;
  },

  // ==========================================================
  // CROPS
  // ==========================================================

  getMyCrops: async () => {
    const response =
      await axiosInstance.get(
        "/api/farmers/crops"
      );

    return response.data;
  },

  getCrops: async () => {
    const response =
      await axiosInstance.get(
        "/api/farmers/crops"
      );

    return response.data;
  },

  createCrop: async (cropData) => {
    const response =
      await axiosInstance.post(
        "/api/farmers/crops",
        cropData
      );

    return response.data;
  },

  addCrop: async (cropData) => {
    return farmerService.createCrop(
      cropData
    );
  },

  getCrop: async (cropId) => {
    const response =
      await axiosInstance.get(
        `/api/farmers/crops/${cropId}`
      );

    return response.data;
  },

  updateCrop: async (
    cropId,
    cropData
  ) => {

    const response =
      await axiosInstance.put(
        `/api/farmers/crops/${cropId}`,
        cropData
      );

    return response.data;
  },

  editCrop: async (
    cropId,
    cropData
  ) => {

    return farmerService.updateCrop(
      cropId,
      cropData
    );
  },

  deleteCrop: async (cropId) => {

    await axiosInstance.delete(
      `/api/farmers/crops/${cropId}`
    );

    return true;
  },

  removeCrop: async (cropId) => {

    return farmerService.deleteCrop(
      cropId
    );
  },

  // ==========================================================
  // DASHBOARD
  // ==========================================================

  getDashboard: async () => {

    const response =
      await axiosInstance.get(
        "/api/farmers/dashboard"
      );

    return response.data;
  },

  // ==========================================================
  // PRACTICES
  // ==========================================================

  getPracticeLogs: async () => {

    const response =
      await axiosInstance.get(
        "/api/sustainability/practices"
      );

    return response.data;
  },

  submitPractice: async (
    practiceData
  ) => {

    const response =
      await axiosInstance.post(
        "/api/sustainability/practices",
        practiceData
      );

    return response.data;
  },

  createPracticeLog: async (
    practiceData
  ) => {

    return farmerService.submitPractice(
      practiceData
    );
  },

  // ==========================================================
  // BUYERS
  // ==========================================================

  getMarketBuyers: async () => {

    const response =
      await axiosInstance.get(
        "/api/market/buyers"
      );

    return response.data;
  },

  getBuyerById: async (buyerId) => {

    const response =
      await axiosInstance.get(
        `/api/market/buyers/${buyerId}`
      );

    return response.data;
  },

  // ==========================================================
  // BUYER INQUIRY
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

  // ==========================================================
  // SCHEMES
  // ==========================================================

  getSchemes: async () => {

    const response =
      await axiosInstance.get(
        "/api/schemes"
      );

    return response.data;
  },

  getSchemeById: async (schemeId) => {

    const response =
      await axiosInstance.get(
        `/api/schemes/${schemeId}`
      );

    return response.data;
  },

  // ==========================================================
  // AI
  // ==========================================================

  sendChatMessage: async (
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
};

export default farmerService;

export const getProfile =
  farmerService.getProfile;

export const createProfile =
  farmerService.createProfile;

export const updateProfile =
  farmerService.updateProfile;

export const profileExists =
  farmerService.profileExists;

export const getMyCrops =
  farmerService.getMyCrops;

export const getCrops =
  farmerService.getCrops;

export const createCrop =
  farmerService.createCrop;

export const addCrop =
  farmerService.addCrop;

export const getCrop =
  farmerService.getCrop;

export const updateCrop =
  farmerService.updateCrop;

export const editCrop =
  farmerService.editCrop;

export const deleteCrop =
  farmerService.deleteCrop;

export const removeCrop =
  farmerService.removeCrop;

export const getDashboard =
  farmerService.getDashboard;

export const getPracticeLogs =
  farmerService.getPracticeLogs;

export const submitPractice =
  farmerService.submitPractice;

export const createPracticeLog =
  farmerService.createPracticeLog;

export const getMarketBuyers =
  farmerService.getMarketBuyers;

export const getBuyerById =
  farmerService.getBuyerById;

export const sendBuyerInquiry =
  farmerService.sendBuyerInquiry;

export const getMyInquiries =
  farmerService.getMyInquiries;

export const getSchemes =
  farmerService.getSchemes;

export const getSchemeById =
  farmerService.getSchemeById;

export const sendChatMessage =
  farmerService.sendChatMessage;