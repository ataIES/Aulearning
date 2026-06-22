import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

class TaskService {
  async paginate(params = {}) {
    const { data } = await axiosClient.get(ENDPOINTS.tasks.list, {
      params,
    });

    return data;
  }

  async find(id) {
    const { data } = await axiosClient.get(ENDPOINTS.tasks.detail(id));

    return data;
  }

  async create(payload) {
    const { data } = await axiosClient.post(
      ENDPOINTS.tasks.create,
      payload
    );

    return data;
  }

  async update(id, payload) {
    const { data } = await axiosClient.put(
      ENDPOINTS.tasks.update(id),
      payload
    );

    return data;
  }

  async delete(id) {
    const { data } = await axiosClient.delete(
      ENDPOINTS.tasks.delete(id)
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

export default new TaskService();