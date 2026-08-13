import axiosInstance from "../api/axiosInstance";

const adminService = {

  // ==========================================================
  // PRACTICE VERIFICATION
  // ==========================================================

  getPendingPractices: async () => {

    const response =
      await axiosInstance.get(
        "/api/sustainability/verification/pending"
      );

    return response.data;
  },

  reviewPractice: async (
    practiceId,
    decision
  ) => {

    const response =
      await axiosInstance.put(
        `/api/sustainability/verification/${practiceId}`,
        decision
      );

    return response.data;
  },

  verifyPractice: async (
    practiceId,
    decision
  ) => {

    return adminService.reviewPractice(
      practiceId,
      decision
    );
  },

  // ==========================================================
  // FARMERS
  // ==========================================================

  getFarmers: async () => {

    const response =
      await axiosInstance.get(
        "/api/farmers/admin"
      );

    return response.data;
  },

  getFarmerById: async (
    farmerId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/farmers/admin/${farmerId}`
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

  getSchemeById: async (
    schemeId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/schemes/${schemeId}`
      );

    return response.data;
  },

  addScheme: async (
    schemeData
  ) => {

    const response =
      await axiosInstance.post(
        "/api/schemes",
        schemeData
      );

    return response.data;
  },

  updateScheme: async (
    schemeId,
    schemeData
  ) => {

    const response =
      await axiosInstance.put(
        `/api/schemes/${schemeId}`,
        schemeData
      );

    return response.data;
  },

  deleteScheme: async (
    schemeId
  ) => {

    await axiosInstance.delete(
      `/api/schemes/${schemeId}`
    );

    return true;
  },

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

  getBuyerById: async (
    buyerId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/market/buyers/${buyerId}`
      );

    return response.data;
  },

  createBuyer: async (
    buyerData
  ) => {

    const response =
      await axiosInstance.post(
        "/api/market/buyers",
        buyerData
      );

    return response.data;
  },

  updateBuyer: async (
    buyerId,
    buyerData
  ) => {

    const response =
      await axiosInstance.put(
        `/api/market/buyers/${buyerId}`,
        buyerData
      );

    return response.data;
  },

  deleteBuyer: async (
    buyerId
  ) => {

    await axiosInstance.delete(
      `/api/market/buyers/${buyerId}`
    );

    return true;
  },

  // ==========================================================
  // ADMINS
  // ==========================================================

  getAdmins: async () => {

    const response =
      await axiosInstance.get(
        "/api/auth/admin/users"
      );

    return response.data;
  },

  getAdminById: async (
    adminId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/auth/admin/users/${adminId}`
      );

    return response.data;
  },

  createAdmin: async (
    adminData
  ) => {

    const response =
      await axiosInstance.post(
        "/api/auth/admin/users",
        adminData
      );

    return response.data;
  },

  updateAdminStatus: async (
    adminId,
    status
  ) => {

    const response =
      await axiosInstance.patch(
        `/api/auth/admin/users/${adminId}/status`,
        {
          active: status,
        }
      );

    return response.data;
  },

  deleteAdmin: async (
    adminId
  ) => {

    await axiosInstance.delete(
      `/api/auth/admin/users/${adminId}`
    );

    return true;
  },

};

export default adminService;

export const getPendingPractices =
  adminService.getPendingPractices;

export const reviewPractice =
  adminService.reviewPractice;

export const verifyPractice =
  adminService.verifyPractice;

export const getFarmers =
  adminService.getFarmers;

export const getFarmerById =
  adminService.getFarmerById;

export const getSchemes =
  adminService.getSchemes;

export const getSchemeById =
  adminService.getSchemeById;

export const addScheme =
  adminService.addScheme;

export const updateScheme =
  adminService.updateScheme;

export const deleteScheme =
  adminService.deleteScheme;

export const getBuyers =
  adminService.getBuyers;

export const getBuyerById =
  adminService.getBuyerById;

export const createBuyer =
  adminService.createBuyer;

export const updateBuyer =
  adminService.updateBuyer;

export const deleteBuyer =
  adminService.deleteBuyer;

export const getAdmins =
  adminService.getAdmins;

export const getAdminById =
  adminService.getAdminById;

export const createAdmin =
  adminService.createAdmin;

export const updateAdminStatus =
  adminService.updateAdminStatus;

export const deleteAdmin =
  adminService.deleteAdmin;