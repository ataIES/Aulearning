import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

class FileService {
  async paginate(params = {}) {
    const { data } = await axiosClient.get(ENDPOINTS.files.list, {
      params,
    });

    return data;
  }

  async upload(payload) {
    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });

    const { data } = await axiosClient.post(
      ENDPOINTS.files.create,
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
    const { data } = await axiosClient.delete(ENDPOINTS.files.delete(id));

    return data;
  }
}

export default new FileService();