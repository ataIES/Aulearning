import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

class DashboardService {
  async admin() {
    const { data } = await axiosClient.get(ENDPOINTS.dashboard.admin);
    return data;
  }
  async teacher() {
    const { data } = await axiosClient.get(
      ENDPOINTS.dashboard.teacher
    );

    return data;
  }

  async student() {
    const { data } = await axiosClient.get(
      ENDPOINTS.dashboard.student
    );

    return data;
  }
}

export default new DashboardService();