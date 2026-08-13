import axios from "axios";

// ============================================================
// FARMXP API AXIOS INSTANCE
// ============================================================

const axiosInstance = axios.create({
  baseURL: "http://localhost:9090",
  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

axiosInstance.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("farmxp_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token");

    // --------------------------------------------------------
    // IMPORTANT:
    // Do NOT add Authorization header to login/register.
    // This avoids unnecessary CORS preflight complications.
    // --------------------------------------------------------

    const isAuthRequest =
      config.url === "/api/auth/login" ||
      config.url === "/api/auth/register";

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      "FarmXP API Request:",
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );

    return config;
  },

  (error) => {
    console.error("FarmXP Request Error:", error);
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

axiosInstance.interceptors.response.use(

  // ----------------------------------------------------------
  // SUCCESS
  // ----------------------------------------------------------

  (response) => {

    console.log(
      "FarmXP API Response:",
      response.status,
      response.config?.url
    );

    return response;
  },

  // ----------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------

  (error) => {

    const status = error.response?.status;
    const data = error.response?.data;

    console.error("FarmXP API Error:", {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      status: status,
      response: data,
    });

    // --------------------------------------------------------
    // NETWORK / CORS ERROR
    // --------------------------------------------------------

    if (!error.response) {

      console.error(
        "FarmXP: No response received from API Gateway."
      );

      console.error(
        "Make sure API Gateway is running on http://localhost:9090"
      );
    }

    // --------------------------------------------------------
    // 401 UNAUTHORIZED
    // --------------------------------------------------------

    if (status === 401) {

      console.warn(
        "FarmXP: Unauthorized request."
      );

      /*
       * Do NOT automatically logout here.
       *
       * Login itself can return 401 when credentials are wrong.
       * Let the calling component handle it.
       */
    }

    // --------------------------------------------------------
    // 403 FORBIDDEN
    // --------------------------------------------------------

    if (status === 403) {

      console.warn(
        "FarmXP: Forbidden request."
      );
    }

    // --------------------------------------------------------
    // 404 NOT FOUND
    // --------------------------------------------------------

    if (status === 404) {

      console.warn(
        "FarmXP: API endpoint not found:",
        error.config?.url
      );
    }

    // --------------------------------------------------------
    // 500 SERVER ERROR
    // --------------------------------------------------------

    if (status >= 500) {

      console.error(
        "FarmXP: Backend server error."
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;