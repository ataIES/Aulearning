import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

class FileService {
  async paginate(params = {}) {
    const { data } = await axiosClient.get(
      ENDPOINTS.files.list,
      {
        params,
      }
    );

    return data;
  }

  async upload(payload) {
    const formData = new FormData();

    formData.append(
      'task_id',
      payload.task_id
    );

    formData.append(
      'file',
      payload.file
    );

    const { data } = await axiosClient.post(
      ENDPOINTS.files.create,
      formData
    );

    return data;
  }

  async delete(id) {
    const { data } = await axiosClient.delete(
      ENDPOINTS.files.delete(id)
    );

    return data;
  }
}

export default new FileService();