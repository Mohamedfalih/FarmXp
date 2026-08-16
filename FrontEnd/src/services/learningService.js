import axiosInstance from "../api/axiosInstance";

const learningService = {

  // ==========================================================
  // MODULES
  // ==========================================================

  getModules: async () => {

    const response =
      await axiosInstance.get(
        "/api/learning/modules"
      );

    return response.data;
  },

  getModule: async (
    moduleId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/learning/modules/${moduleId}`
      );

    return response.data;
  },

  getModuleById: async (
    moduleId
  ) => {

    return learningService.getModule(
      moduleId
    );
  },

  getModuleContent: async (
    moduleId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/learning/modules/${moduleId}/content`
      );

    return response.data;
  },

  // ==========================================================
  // GAMES
  // ==========================================================

  getGame: async (
    gameId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/learning/games/${gameId}`
      );

    return response.data;
  },

  getGames: async () => {

    // There is no plain GET /games in your backend.
    // Modules contain games.
    const response =
      await axiosInstance.get(
        "/api/learning/modules"
      );

    return response.data;
  },

  getGamesByModule: async (
    moduleId
  ) => {

    // Use the farmer-accessible module content endpoint
    // which returns { module, games: [...] }
    const response =
      await axiosInstance.get(
        `/api/learning/modules/${moduleId}/content`
      );

    return response.data?.games || [];
  },

  // ==========================================================
  // QUESTIONS
  // ==========================================================

  getQuestions: async (
    gameId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/learning/games/${gameId}/questions`
      );

    return response.data;
  },

  checkAnswer: async (
    answerData
  ) => {

    const response =
      await axiosInstance.post(
        "/api/learning/questions/check-answer",
        answerData
      );

    return response.data;
  },

  // ==========================================================
  // PROGRESS
  // ==========================================================

  getProgress: async () => {

    const response =
      await axiosInstance.get(
        "/api/learning/progress"
      );

    return response.data;
  },

  getModuleProgress: async () => {

    const response =
      await axiosInstance.get(
        "/api/learning/progress/modules"
      );

    return response.data;
  },

  completeModule: async (moduleId) => {
    const response = await axiosInstance.post(
      `/api/learning/progress/modules/${moduleId}/complete`
    );
    return response.data;
  },

  getSummary: async () => {

    const response =
      await axiosInstance.get(
        "/api/learning/progress/summary"
      );

    return response.data;
  },

  startGame: async (
    moduleId,
    gameId
  ) => {

    const response =
      await axiosInstance.post(
        `/api/learning/progress/modules/${moduleId}/games/${gameId}/start`
      );

    return response.data;
  },

  submitGame: async (
    moduleId,
    gameId,
    answers
  ) => {

    const response =
      await axiosInstance.post(
        `/api/learning/progress/modules/${moduleId}/games/${gameId}/submit`,
        answers
      );

    return response.data;
  },

  // Compatibility methods used by your existing pages

  getQuizByModuleId: async (
    moduleId
  ) => {

    const content =
      await learningService.getModuleContent(
        moduleId
      );

    const games =
      content?.games || [];

    return {
      module: content?.module,
      games,
    };
  },

  startQuiz: async (
    moduleId,
    gameId
  ) => {

    return learningService.startGame(
      moduleId,
      gameId
    );
  },

  submitQuiz: async (
    moduleId,
    gameId,
    answers
  ) => {

    return learningService.submitGame(
      moduleId,
      gameId,
      answers
    );
  },
};

export default learningService;