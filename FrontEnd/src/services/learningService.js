import axiosInstance from "../api/axiosInstance";

const learningService = {

  // =========================================================
  // MODULES
  // =========================================================

  getModules: async () => {
    const response = await axiosInstance.get(
      "/api/learning/modules"
    );

    return response.data;
  },

  getModule: async (moduleId) => {
    const response = await axiosInstance.get(
      `/api/learning/modules/${moduleId}`
    );

    return response.data;
  },

  // =========================================================
  // GAMES
  // =========================================================

  getGames: async () => {
    const response = await axiosInstance.get(
      "/api/learning/games"
    );

    return response.data;
  },

  getGame: async (gameId) => {
    const response = await axiosInstance.get(
      `/api/learning/games/${gameId}`
    );

    return response.data;
  },

  // =========================================================
  // QUESTIONS
  // =========================================================

  getQuestions: async (gameId) => {
    const response = await axiosInstance.get(
      `/api/learning/games/${gameId}/questions`
    );

    return response.data;
  },

  // =========================================================
  // PROGRESS
  // =========================================================

  getProgress: async () => {
    const response = await axiosInstance.get(
      "/api/learning/progress"
    );

    return response.data;
  },

  updateProgress: async (progressData) => {
    const response = await axiosInstance.post(
      "/api/learning/progress",
      progressData
    );

    return response.data;
  },

};

export default learningService;