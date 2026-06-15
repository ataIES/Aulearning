import { ENDPOINTS } from '../api/endpoints';
import BaseService from './BaseService';

class CourseService extends BaseService {
  constructor() {
    super(ENDPOINTS.courses.list);
  }
}

export default new CourseService();