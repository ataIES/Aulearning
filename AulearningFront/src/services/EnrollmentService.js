import { ENDPOINTS } from '../api/endpoints';
import BaseService from './BaseService';

class EnrollmentService extends BaseService {
  constructor() {
    super(ENDPOINTS.enrollments.list);
  }
}

export default new EnrollmentService();