import { ENDPOINTS } from '../api/endpoints';
import BaseService from './BaseService';
import axiosClient from '../api/axiosClient';

class RoleService extends BaseService {
  constructor() {
    super(ENDPOINTS.roles.list);
  }

  async syncPermissions(id, permissions) {
    const { data } = await axiosClient.put(
      ENDPOINTS.roles.syncPermissions(id),
      { permissions }
    );

    return data;
  }
}

export default new RoleService();