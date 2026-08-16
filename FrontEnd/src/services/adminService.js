import axiosInstance from "../api/axiosInstance";

const adminService = {

  // ==========================================================
  // UTILS
  // ==========================================================

  formatDateForBackend: (dateVal) => {
    if (!dateVal) return null;
    if (Array.isArray(dateVal)) {
      if (dateVal.length >= 3) {
        return `${dateVal[0]}-${String(dateVal[1]).padStart(2, '0')}-${String(dateVal[2]).padStart(2, '0')}`;
      }
      return null;
    }
    // If it's already a string in YYYY-MM-DD, just return it
    if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
      return dateVal;
    }
    // Fallback parsing
    const parsed = Date.parse(dateVal);
    if (!isNaN(parsed)) {
      return new Date(parsed).toISOString().split('T')[0];
    }
    return null;
  },

  formatDateForFrontend: (dateVal) => {
    if (!dateVal) return '';
    if (Array.isArray(dateVal)) {
      if (dateVal.length >= 3) {
        return `${dateVal[0]}-${String(dateVal[1]).padStart(2, '0')}-${String(dateVal[2]).padStart(2, '0')}`;
      }
      return '';
    }
    if (typeof dateVal === 'string') {
      // Return just the date part if it's an ISO string, otherwise return as is assuming it's YYYY-MM-DD
      return dateVal.split('T')[0];
    }
    return '';
  },

  // ==========================================================
  // PRACTICE VERIFICATION
  // ==========================================================

  getPendingPractices: async () => {
    const response = await axiosInstance.get(
      "/api/sustainability/verification/pending"
    );
    return response.data;
  },

  getPracticesByStatus: async (status) => {
    const uppercaseStatus = status ? status.toUpperCase() : '';
    const response = await axiosInstance.get(
      `/api/sustainability/verification?status=${uppercaseStatus}`
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

    // Map frontend fields to backend DTO fields
    const payload = {
      title: schemeData.schemeName || schemeData.title,
      description: schemeData.benefitSummary || schemeData.description,
      lastDate: adminService.formatDateForBackend(schemeData.deadline),
      status: "ACTIVE",
      eligibility: schemeData.eligibilityCriteria || schemeData.eligibility,
      benefits: schemeData.benefitSummary || schemeData.benefits,
      department: schemeData.category || schemeData.department || schemeData.agency,
      officialWebsiteUrl: schemeData.officialWebsiteUrl || schemeData.websiteUrl || schemeData.url,
      applicationUrl: schemeData.applicationUrl,
      minFarmSize: schemeData.minFarmSize ? parseFloat(schemeData.minFarmSize) : null,
      applicableCrops: schemeData.applicableCrops || null
    };

    const response =
      await axiosInstance.post(
        "/api/schemes",
        payload
      );

    return response.data;
  },

  updateScheme: async (
    schemeId,
    schemeData
  ) => {

    // Normalize status to match SchemeStatus enum: ACTIVE / INACTIVE / EXPIRED
    // The frontend stores 'Active' or 'Draft' — backend only accepts uppercase enum values
    const rawStatus = schemeData.status || 'ACTIVE';
    const normalizedStatus = rawStatus.toUpperCase() === 'DRAFT'
      ? 'INACTIVE'
      : rawStatus.toUpperCase();

    const payload = {
      title: schemeData.schemeName || schemeData.title,
      // 'description' is the backend DTO field — map from description OR benefitSummary
      description: schemeData.description || schemeData.benefitSummary || schemeData.title || '',
      lastDate: adminService.formatDateForBackend(schemeData.deadline),
      status: normalizedStatus,
      eligibility: schemeData.eligibilityCriteria || schemeData.eligibility,
      benefits: schemeData.benefits || schemeData.benefitSummary,
      department: schemeData.category || schemeData.department || schemeData.agency,
      officialWebsiteUrl: schemeData.officialWebsiteUrl || schemeData.websiteUrl || schemeData.url,
      applicationUrl: schemeData.applicationUrl,
      minFarmSize: schemeData.minFarmSize ? parseFloat(schemeData.minFarmSize) : null,
      applicableCrops: schemeData.applicableCrops || null
    };

    const response =
      await axiosInstance.put(
        `/api/schemes/${schemeId}`,
        payload
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

    const buyers = Array.isArray(response.data) ? response.data : (response.data?.content || []);
    return buyers.map(item => ({
      ...item,
      id: item.buyerId || item.id,
      name: item.businessName || item.name,
      location: [item.district, item.state].filter(Boolean).join(', ') || item.address || item.location,
      crops: item.requiredCrops || item.crops,
      category: item.buyerType || item.category,
      status: item.status
    }));
  },

  getBuyerById: async (
    buyerId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/market/buyers/${buyerId}`
      );

    const item = response.data;
    if (!item) return item;

    return {
      ...item,
      id: item.buyerId || item.id,
      name: item.businessName || item.name,
      location: [item.district, item.state].filter(Boolean).join(', ') || item.address || item.location,
      crops: item.requiredCrops || item.crops,
      category: item.buyerType || item.category,
      status: item.status
    };
  },

  createBuyer: async (
    buyerData
  ) => {

    const payload = {
      businessName: buyerData.name || buyerData.businessName,
      contactPerson: buyerData.contactPerson,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address || buyerData.location,
      district: buyerData.district,
      state: buyerData.state,
      buyerType: buyerData.category || buyerData.buyerType,
      requiredCrops: buyerData.crops || buyerData.requiredCrops
    };

    const response =
      await axiosInstance.post(
        "/api/market/buyers",
        payload
      );

    return response.data;
  },

  updateBuyer: async (
    buyerId,
    buyerData
  ) => {

    const payload = {
      businessName: buyerData.name || buyerData.businessName,
      contactPerson: buyerData.contactPerson,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address || buyerData.location,
      district: buyerData.district,
      state: buyerData.state,
      buyerType: buyerData.category || buyerData.buyerType,
      requiredCrops: buyerData.crops || buyerData.requiredCrops
    };

    const response =
      await axiosInstance.put(
        `/api/market/buyers/${buyerId}`,
        payload
      );

    return response.data;
  },

  updateBuyerStatus: async (
    buyerId,
    status
  ) => {

    const response =
      await axiosInstance.patch(
        `/api/market/buyers/${buyerId}/status?status=${status.toUpperCase()}`
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

    const payload = {
      username: adminData.name || adminData.username,
      email: adminData.email,
      password: adminData.password,
      phone: adminData.phone,
    };

    const response =
      await axiosInstance.post(
        "/api/auth/admin/users",
        payload
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

  // ==========================================================
  // LEARNING MODULES
  // ==========================================================

  getAdminModules: async () => {
    const response = await axiosInstance.get('/api/learning/admin/modules');
    return response.data;
  },

  createModule: async (moduleData) => {
    const response = await axiosInstance.post('/api/learning/admin/modules', moduleData);
    return response.data;
  },

  updateModule: async (moduleId, moduleData) => {
    const response = await axiosInstance.put(`/api/learning/admin/modules/${moduleId}`, moduleData);
    return response.data;
  },

  deleteModule: async (moduleId) => {
    await axiosInstance.delete(`/api/learning/admin/modules/${moduleId}`);
    return true;
  },

  getModuleGames: async (moduleId) => {
    const response = await axiosInstance.get(`/api/learning/admin/modules/${moduleId}/games`);
    return response.data;
  },

  createGame: async (moduleId, gameData) => {
    const response = await axiosInstance.post(`/api/learning/admin/modules/${moduleId}/games`, gameData);
    return response.data;
  },

  updateGame: async (gameId, gameData) => {
    const response = await axiosInstance.put(`/api/learning/admin/games/${gameId}`, gameData);
    return response.data;
  },

  deleteGame: async (gameId) => {
    await axiosInstance.delete(`/api/learning/admin/games/${gameId}`);
    return true;
  },

  getGameQuestions: async (gameId) => {
    // Falls back to public endpoint since admin specific get questions is missing
    const response = await axiosInstance.get(`/api/learning/games/${gameId}/questions`);
    return response.data;
  },

  createQuestion: async (gameId, questionData) => {
    const response = await axiosInstance.post(`/api/learning/admin/games/${gameId}/questions`, questionData);
    return response.data;
  },

  deleteQuestion: async (questionId) => {
    await axiosInstance.delete(`/api/learning/admin/questions/${questionId}`);
    return true;
  },
};

export default adminService;

export const formatDateForBackend =
  adminService.formatDateForBackend;

export const formatDateForFrontend =
  adminService.formatDateForFrontend;

export const getPendingPractices =
  adminService.getPendingPractices;

export const getPracticesByStatus =
  adminService.getPracticesByStatus;


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

export const updateBuyerStatus =
  adminService.updateBuyerStatus;

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

export const getAdminModules = adminService.getAdminModules;
export const createModule = adminService.createModule;
export const updateModule = adminService.updateModule;
export const deleteModule = adminService.deleteModule;
export const getModuleGames = adminService.getModuleGames;
export const createGame = adminService.createGame;
export const updateGame = adminService.updateGame;
export const deleteGame = adminService.deleteGame;
export const getGameQuestions = adminService.getGameQuestions;
export const createQuestion = adminService.createQuestion;
export const deleteQuestion = adminService.deleteQuestion;