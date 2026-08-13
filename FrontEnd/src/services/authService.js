import axiosInstance from "../api/axiosInstance";


/*
 * ============================================================
 * AUTH SERVICE
 * ============================================================
 */


const authService = {

  // ==========================================================
  // LOGIN
  // ==========================================================

  login: async ({
    identifier,
    email,
    username,
    password,
    role
  }) => {

    const loginData = {
      identifier:
        identifier ||
        email ||
        username,

      password,
      role
    };

    const response = await axiosInstance.post(
      "/api/auth/login",
      loginData
    );

    const data = response.data;


    /*
     * Store JWT.
     *
     * Different backend response versions may use:
     * token / accessToken / jwt
     */

    const token =
      data.token ||
      data.accessToken ||
      data.jwt;

    if (token) {
      localStorage.setItem(
        "token",
        token
      );
    }


    if (data.role) {
      localStorage.setItem(
        "role",
        data.role
      );
    }


    if (data.farmerId) {
      localStorage.setItem(
        "farmerId",
        String(data.farmerId)
      );
    }


    return data;
  },


  // ==========================================================
  // REGISTER
  // ==========================================================

  register: async (formData) => {

    const response = await axiosInstance.post(
      "/api/auth/register",
      formData
    );

    const data = response.data;


    const token =
      data.token ||
      data.accessToken ||
      data.jwt;

    if (token) {
      localStorage.setItem(
        "token",
        token
      );
    }


    if (data.role) {
      localStorage.setItem(
        "role",
        data.role
      );
    }


    if (data.farmerId) {
      localStorage.setItem(
        "farmerId",
        String(data.farmerId)
      );
    }


    return data;
  },


  // ==========================================================
  // CURRENT USER
  // ==========================================================

  getCurrentUser: async () => {

    const response = await axiosInstance.get(
      "/api/auth/me"
    );

    return response.data;
  },


  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  updatePassword: async (
    passwordData
  ) => {

    const response = await axiosInstance.post(
      "/api/auth/change-password",
      passwordData
    );

    return response.data;
  },


  // ==========================================================
  // LOGOUT
  // ==========================================================

  logout: () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "farmerId"
    );

    sessionStorage.removeItem(
      "token"
    );
  },


  // ==========================================================
  // TOKEN
  // ==========================================================

  getToken: () => {

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token")
    );
  },


  // ==========================================================
  // ROLE
  // ==========================================================

  getRole: () => {

    return localStorage.getItem(
      "role"
    );
  },


  // ==========================================================
  // AUTHENTICATED
  // ==========================================================

  isAuthenticated: () => {

    return Boolean(
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token")
    );
  }

};


export default authService;