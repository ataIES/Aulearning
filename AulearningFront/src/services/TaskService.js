import api from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import BaseService from './BaseService';

class TaskService extends BaseService {
  constructor() {
    super(ENDPOINTS.tasks.list);
  }
}

export default new TaskService();