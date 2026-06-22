import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

class AuthService {
  async login(payload) {
    const { data } = await axiosClient.post(ENDPOINTS.auth.login, payload);
    return data;
  }

  async me() {
    const { data } = await axiosClient.get(ENDPOINTS.auth.me);
    return data;
  }

  async logout() {
    const { data } = await axiosClient.post(ENDPOINTS.auth.logout);
    return data;
  }
}

export default new AuthService();