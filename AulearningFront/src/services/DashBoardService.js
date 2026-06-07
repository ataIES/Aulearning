import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

class DashBoardService {
  async getAdminDashboard() {
    const { data } = await axiosClient.get(
      ENDPOINTS.dashboard.admin
    );

    return data;
  }
}

export default new DashBoardService();