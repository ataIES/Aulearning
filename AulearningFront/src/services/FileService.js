import { ENDPOINTS } from '../api/endpoints';
import BaseService from './BaseService';

class FileService extends BaseService {
  constructor() {
    super(ENDPOINTS.files.list);
  }
}

export default new FileService();