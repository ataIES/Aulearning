import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

class PermissionService {
  async list(params = {}) {
    const { data } = await axiosClient.get(
      ENDPOINTS.permissions.list,
      { params }
    );

    return data;
  }
}

export default new PermissionService();