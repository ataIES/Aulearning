import axiosClient from '../api/axiosClient';

export default class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getAll(params = {}) {
    const { data } = await axiosClient.get(this.endpoint, { params });
    return data;
  }

  async getById(id) {
    const { data } = await axiosClient.get(`${this.endpoint}/${id}`);
    return data;
  }

  async create(payload) {
    const { data } = await axiosClient.post(this.endpoint, payload);
    return data;
  }

  async update(id, payload) {
    const { data } = await axiosClient.put(`${this.endpoint}/${id}`, payload);
    return data;
  }

  async delete(id) {
    const { data } = await axiosClient.delete(`${this.endpoint}/${id}`);
    return data;
  }
}