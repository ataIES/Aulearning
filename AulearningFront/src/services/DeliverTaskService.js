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
    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      if (key === 'files') {
        payload.files.forEach((file) => {
          formData.append('files[]', file);
        });
      } else if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });

    const { data } = await axiosClient.post(
      ENDPOINTS.deliveries.create,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  }

  async update(id, payload) {
    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      if (key === 'files') {
        payload.files.forEach((file) => {
          formData.append('files[]', file);
        });
      } else if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });

    formData.append('_method', 'PUT');

    const { data } = await axiosClient.post(
      ENDPOINTS.deliveries.update(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  }

  async delete(id) {
    const { data } = await axiosClient.delete(
      ENDPOINTS.deliveries.delete(id)
    );

    return data;
  }

  async getByStudent(studentId, params = {}) {
    return this.paginate({
      student_id: studentId,
      ...params,
    });
  }
}

export default new DeliverTaskService();