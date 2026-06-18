import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

class EnrollmentService {
  async paginate(params = {}) {
    const { data } = await axiosClient.get(ENDPOINTS.enrollments.list, {
      params,
    });

    return data;
  }

  async getByCourse(courseId, params = {}) {
    return this.paginate({
      course_id: courseId,
      ...params,
    });
  }
}

export default new EnrollmentService();