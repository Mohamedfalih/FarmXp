import axiosInstance from "../api/axiosInstance";

// ============================================================
// AUTH SERVICE
// ============================================================

const authService = {

  // ==========================================================
  // LOGIN
  // ==========================================================

  login: async ({ identifier, username, email, password, role }) => {

    const loginIdentifier =
      identifier?.trim() ||
      username?.trim() ||
      email?.trim();

    if (!loginIdentifier) {
      throw new Error("Username or email is required");
    }

    if (!password || !password.trim()) {
      throw new Error("Password is required");
    }

    // ========================================================
    // BACKEND EXPECTS:
    //
    // {
    //     "username": "...",
    //     "password": "..."
    // }
    //
    // Backend AuthService searches:
    // 1. username
    // 2. email
    // ========================================================

    try {

      const response = await axiosInstance.post(
        "/api/auth/login",
        {
          username: loginIdentifier,
          password: password
        }
      );

      const data = response.data;

      // ======================================================
      // JWT VALIDATION
      // ======================================================

      if (!data || !data.token) {
        throw new Error(
          data?.message || "Login failed. Token was not returned."
        );
      }

      // ======================================================
      // ROLE VALIDATION
      // ======================================================

      if (
        role &&
        data.role &&
        data.role.toUpperCase() !== role.toUpperCase()
      ) {
        throw new Error(
          `This account is registered as ${data.role}, not ${role}.`
        );
      }

      // ======================================================
      // STORE JWT
      // ======================================================

      localStorage.setItem(
        "farmxp_token",
        data.token
      );

      // Keep this for compatibility with existing frontend code
      localStorage.setItem(
        "token",
        data.token
      );

      // ======================================================
      // STORE USER ID
      // ======================================================

      if (
        data.userId !== undefined &&
        data.userId !== null
      ) {

        localStorage.setItem(
          "farmxp_userId",
          String(data.userId)
        );

        localStorage.setItem(
          "farmerId",
          String(data.userId)
        );
      }

      // ======================================================
      // STORE USERNAME
      // ======================================================

      if (data.username) {

        localStorage.setItem(
          "farmxp_username",
          data.username
        );
      }

      // ======================================================
      // STORE EMAIL
      // ======================================================

      if (data.email) {

        localStorage.setItem(
          "farmxp_email",
          data.email
        );
      }

      // ======================================================
      // STORE ROLE
      // ======================================================

      if (data.role) {

        const normalizedRole =
          data.role.toUpperCase();

        localStorage.setItem(
          "farmxp_role",
          normalizedRole
        );

        localStorage.setItem(
          "role",
          normalizedRole
        );
      }

      return data;

    } catch (error) {

      console.error(
        "FarmXP Login Error:",
        error.response?.data || error.message
      );

      // Preserve backend's actual error message
      const backendMessage =
        error.response?.data?.message;

      if (backendMessage) {
        throw new Error(backendMessage);
      }

      if (error.message) {
        throw new Error(error.message);
      }

      throw new Error(
        "Unable to connect to FarmXP authentication service."
      );
    }
  },

  // ==========================================================
  // REGISTER FARMER
  // ==========================================================

  register: async (formData) => {

    if (!formData.email?.trim()) {
      throw new Error("Email is required");
    }

    if (!formData.password) {
      throw new Error("Password is required");
    }

    // ========================================================
    // USERNAME
    // ========================================================

    const username =
      formData.username?.trim() ||
      formData.email.trim();

    // ========================================================
    // REGISTER AUTH ACCOUNT
    // ========================================================

    const registerResponse =
      await axiosInstance.post(
        "/api/auth/register",
        {
          username: username,
          email: formData.email.trim(),
          password: formData.password
        }
      );

    const registeredUser =
      registerResponse.data;

    // ========================================================
    // LOGIN AFTER REGISTRATION
    // ========================================================

    const loginData =
      await authService.login({
        username: username,
        password: formData.password,
        role: "FARMER"
      });

    // ========================================================
    // CREATE FARMER PROFILE
    // ========================================================

    const profileData = {

      fullName:
        formData.name?.trim() ||
        username,

      phone:
        formData.phone?.trim() || "",

      state:
        formData.state || "",

      district:
        formData.location?.trim() || "",

      village:
        formData.location?.trim() || "",

      farmName:
        `${formData.name || username}'s Farm`,

      farmSize:
        Number(formData.totalLand) || 0,

      farmSizeUnit: "ACRE"
    };

    try {

      await axiosInstance.post(
        "/api/farmers/profile",
        profileData
      );

    } catch (profileError) {

      console.error(
        "Farmer profile creation failed:",
        profileError.response?.data ||
        profileError.message
      );
    }

    // ========================================================
    // CREATE CROPS
    // ========================================================

    if (
      Array.isArray(formData.crops) &&
      formData.crops.length > 0
    ) {

      for (const crop of formData.crops) {

        try {

          await axiosInstance.post(
            "/api/farmers/crops",
            {
              cropName:
                crop.name?.trim() || "Unknown",

              variety: "",

              area:
                Number(crop.acres) || 0,

              areaUnit: "ACRE",

              season: "CURRENT",

              plantingDate: null,

              expectedHarvestDate: null,

              status: "ACTIVE"
            }
          );

        } catch (cropError) {

          console.error(
            "Crop creation failed:",
            cropError.response?.data ||
            cropError.message
          );
        }
      }
    }

    return {
      ...registeredUser,
      ...loginData
    };
  },

  // ==========================================================
  // CURRENT USER
  // ==========================================================

  getCurrentUser: async () => {

    const response =
      await axiosInstance.get(
        "/api/auth/me"
      );

    return response.data;
  },

  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  updatePassword: async (passwordData) => {

    const response =
      await axiosInstance.post(
        "/api/auth/change-password",
        passwordData
      );

    return response.data;
  },

  // ==========================================================
  // LOGOUT
  // ==========================================================

  logout: () => {

    localStorage.removeItem("farmxp_token");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");

    localStorage.removeItem("farmxp_userId");
    localStorage.removeItem("farmerId");

    localStorage.removeItem("farmxp_username");
    localStorage.removeItem("farmxp_email");

    localStorage.removeItem("farmxp_role");
    localStorage.removeItem("role");

    sessionStorage.removeItem("token");
  },

  // ==========================================================
  // TOKEN
  // ==========================================================

  getToken: () => {

    return (
      localStorage.getItem("farmxp_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token")
    );
  },

  // ==========================================================
  // ROLE
  // ==========================================================

  getRole: () => {

    return (
      localStorage.getItem("farmxp_role") ||
      localStorage.getItem("role")
    );
  },

  // ==========================================================
  // USER ID
  // ==========================================================

  getUserId: () => {

    return (
      localStorage.getItem("farmxp_userId") ||
      localStorage.getItem("farmerId")
    );
  },

  // ==========================================================
  // AUTHENTICATED
  // ==========================================================

  isAuthenticated: () => {

    return Boolean(
      localStorage.getItem("farmxp_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken")
    );
  }
};

export default authService;