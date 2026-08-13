import axiosInstance from "../api/axiosInstance";

const notificationService = {

  getNotifications: async () => {
    const response = await axiosInstance.get(
      "/api/notifications"
    );

    return response.data;
  },

  getNotification: async (notificationId) => {
    const response = await axiosInstance.get(
      `/api/notifications/${notificationId}`
    );

    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await axiosInstance.patch(
      `/api/notifications/${notificationId}/read`
    );

    return response.data;
  },

};

export default notificationService;