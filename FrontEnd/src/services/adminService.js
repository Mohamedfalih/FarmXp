import axiosInstance from "../api/axiosInstance";


/*
 * ============================================================
 * ADMIN SERVICE
 * ============================================================
 *
 * Supports both default imports and all named imports used by
 * the existing Admin pages.
 *
 * ============================================================
 */


const adminService = {

  // ==========================================================
  // PRACTICE VERIFICATION
  // ==========================================================

  getPendingPractices: async () => {
    const response = await axiosInstance.get(
      "/api/sustainability/verification/pending"
    );

    return response.data;
  },

  reviewPractice: async (
    practiceId,
    decision
  ) => {

    const response = await axiosInstance.put(
      `/api/sustainability/verification/${practiceId}`,
      decision
    );

    return response.data;
  },

  verifyPractice: async (
    practiceId,
    decision
  ) => {

    const response = await axiosInstance.put(
      `/api/sustainability/verification/${practiceId}`,
      decision
    );

    return response.data;
  },


  // ==========================================================
  // FARMERS
  // ==========================================================

  getFarmers: async () => {

    const response = await axiosInstance.get(
      "/api/farmers"
    );

    return response.data;
  },

  getFarmerById: async (farmerId) => {

    const response = await axiosInstance.get(
      `/api/farmers/${farmerId}`
    );

    return response.data;
  },


  // ==========================================================
  // SCHEMES
  // ==========================================================

  getSchemes: async () => {

    const response = await axiosInstance.get(
      "/api/schemes"
    );

    return response.data;
  },

  getSchemeById: async (schemeId) => {

    const response = await axiosInstance.get(
      `/api/schemes/${schemeId}`
    );

    return response.data;
  },

  addScheme: async (schemeData) => {

    const response = await axiosInstance.post(
      "/api/schemes",
      schemeData
    );

    return response.data;
  },

  updateScheme: async (
    schemeId,
    schemeData
  ) => {

    const response = await axiosInstance.put(
      `/api/schemes/${schemeId}`,
      schemeData
    );

    return response.data;
  },

  deleteScheme: async (schemeId) => {

    const response = await axiosInstance.delete(
      `/api/schemes/${schemeId}`
    );

    return response.data;
  },


  // ==========================================================
  // MARKET BUYERS
  // ==========================================================

  getBuyers: async () => {

    const response = await axiosInstance.get(
      "/api/market/buyers"
    );

    return response.data;
  },

  getBuyerById: async (buyerId) => {

    const response = await axiosInstance.get(
      `/api/market/buyers/${buyerId}`
    );

    return response.data;
  },

  createBuyer: async (buyerData) => {

    const response = await axiosInstance.post(
      "/api/market/buyers",
      buyerData
    );

    return response.data;
  },

  updateBuyer: async (
    buyerId,
    buyerData
  ) => {

    const response = await axiosInstance.put(
      `/api/market/buyers/${buyerId}`,
      buyerData
    );

    return response.data;
  },

  deleteBuyer: async (buyerId) => {

    const response = await axiosInstance.delete(
      `/api/market/buyers/${buyerId}`
    );

    return response.data;
  },


  // ==========================================================
  // ADMINS
  // ==========================================================

  getAdmins: async () => {

    /*
     * Current backend does not have a dedicated
     * /api/auth/admins endpoint.
     *
     * Keep this function so AdminManagement.jsx does not
     * produce a JavaScript export error.
     */
    throw new Error(
      "Admin management API is not available in the current backend."
    );
  },

  getAdminById: async (adminId) => {

    throw new Error(
      "Admin management API is not available in the current backend."
    );
  },

  createAdmin: async (adminData) => {

    throw new Error(
      "Admin creation API is not available in the current backend."
    );
  },

  updateAdminStatus: async (
    adminId,
    status
  ) => {

    throw new Error(
      "Admin management API is not available in the current backend."
    );
  },

  deleteAdmin: async (adminId) => {

    throw new Error(
      "Admin management API is not available in the current backend."
    );
  },


  // ==========================================================
  // ADMIN DASHBOARD
  // ==========================================================

  getDashboardStats: async () => {

    throw new Error(
      "Admin dashboard statistics API is not available in the current backend."
    );
  },

  getRecentActivity: async () => {

    throw new Error(
      "Admin recent activity API is not available in the current backend."
    );
  },

};


export default adminService;


// ============================================================
// NAMED EXPORTS
// ============================================================


// Practice verification

export const getPendingPractices =
  adminService.getPendingPractices;

export const reviewPractice =
  adminService.reviewPractice;

export const verifyPractice =
  adminService.verifyPractice;


// Farmers

export const getFarmers =
  adminService.getFarmers;

export const getFarmerById =
  adminService.getFarmerById;


// Schemes

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


// Buyers

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


// Admin management

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


// Dashboard

export const getDashboardStats =
  adminService.getDashboardStats;

export const getRecentActivity =
  adminService.getRecentActivity;