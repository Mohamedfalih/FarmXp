import axiosInstance from "../api/axiosInstance";

const notificationService = {

  // ==========================================================
  // MY NOTIFICATIONS
  // ==========================================================

  getNotifications: async () => {

    const response =
      await axiosInstance.get(
        "/api/notifications/my"
      );

    return response.data;
  },

  getUnreadNotifications: async () => {

    const response =
      await axiosInstance.get(
        "/api/notifications/my/unread"
      );

    return response.data;
  },

  getUnreadCount: async () => {

    const response =
      await axiosInstance.get(
        "/api/notifications/my/unread/count"
      );

    return response.data;
  },

  markAllAsRead: async () => {

    const response =
      await axiosInstance.put(
        "/api/notifications/my/read-all"
      );

    return response.data;
  },

  // ==========================================================
  // ADMIN / DIRECT NOTIFICATION
  // ==========================================================

  getNotification: async (
    notificationId
  ) => {

    const response =
      await axiosInstance.get(
        `/api/notifications/${notificationId}`
      );

    return response.data;
  },

  markAsRead: async (
    notificationId
  ) => {

    const response =
      await axiosInstance.put(
        `/api/notifications/${notificationId}/read`
      );

    return response.data;
  },

  updatePreferences: async () => {

    /*
     * Your backend currently does not have a notification
     * preferences endpoint.
     */
    throw new Error(
      "Notification preferences API is not implemented in backend."
    );
  },
};

export default notificationService;