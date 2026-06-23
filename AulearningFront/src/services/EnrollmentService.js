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

  async create(payload) {
    const { data } = await axiosClient.post(
      ENDPOINTS.enrollments.create,
      payload
    );

    return data;
  }

  async delete(id) {
    const { data } = await axiosClient.delete(
      ENDPOINTS.enrollments.delete(id)
    );

    return data;
  }
}

export default new EnrollmentService();