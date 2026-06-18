import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

class DeliverTaskService {
  async paginate(params = {}) {
    const { data } = await axiosClient.get(ENDPOINTS.deliveries.list, {
      params,
    });

    return data;
  }

  async find(id) {
    const { data } = await axiosClient.get(
      ENDPOINTS.deliveries.detail(id)
    );

    return data;
  }

  async create(payload) {
    const { data } = await axiosClient.post(
      ENDPOINTS.deliveries.create,
      payload
    );

    return data;
  }

  async update(id, payload) {
    const { data } = await axiosClient.put(
      ENDPOINTS.deliveries.update(id),
      payload
    );

    return data;
  }

  async delete(id) {
    const { data } = await axiosClient.delete(
      ENDPOINTS.deliveries.delete(id)
    );

    return data;
  }

  async getByCourse(courseId, params = {}) {
    return this.paginate({
      course_id: courseId,
      ...params,
    });
  }
}

export default new DeliverTaskService();