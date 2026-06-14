import { ENDPOINTS } from '../api/endpoints';
import BaseService from './BaseService';

class UserService extends BaseService {
  constructor() {
    super(ENDPOINTS.users.list);
  }
}

export default new UserService();