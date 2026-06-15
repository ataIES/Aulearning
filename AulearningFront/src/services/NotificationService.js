import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

class NotificationService {
  async list() {
    const { data } = await axiosClient.get(ENDPOINTS.notifications.list);
    return data;
  }

  async unread() {
    const { data } = await axiosClient.get(ENDPOINTS.notifications.unread);
    return data;
  }

  async markAsRead(id) {
    const { data } = await axiosClient.patch(
      ENDPOINTS.notifications.markAsRead(id)
    );

    return data;
  }
}

export default new NotificationService();