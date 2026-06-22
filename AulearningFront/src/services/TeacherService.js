import CourseService from './CourseService';
import TaskService from './TaskService';
import DeliverTaskService from './DeliverTaskService';
import FileService from './FileService';
import EnrollmentService from './EnrollmentService';

class TeacherService {
  async courses(params = {}) {
    return CourseService.paginate(params);
  }

  async courseDetail(courseId) {
    return CourseService.find(courseId);
  }

  async courseTasks(courseId, params = {}) {
    return TaskService.getByCourse(courseId, params);
  }

  async createTask(payload) {
    return TaskService.create(payload);
  }

  async updateTask(id, payload) {
    return TaskService.update(id, payload);
  }

  async deleteTask(id) {
    return TaskService.delete(id);
  }

  async courseDeliveries(courseId, params = {}) {
    return DeliverTaskService.getByCourse(courseId, params);
  }

  async teacherDeliveries(teacherId, params = {}) {
    return DeliverTaskService.paginate({
      teacher_id: teacherId,
      ...params,
    });
  }

  async updateDelivery(id, payload) {
    return DeliverTaskService.update(id, payload);
  }

  async courseMaterials(params = {}) {
    return FileService.paginate(params);
  }

  async uploadMaterial(payload) {
    return FileService.upload(payload);
  }

  async deleteMaterial(fileId) {
    return FileService.delete(fileId);
  }

  async courseStudents(courseId, params = {}) {
    return EnrollmentService.getByCourse(courseId, params);
  }

  async teacherStudents(teacherId, params = {}) {
    return EnrollmentService.paginate({
      teacher_id: teacherId,
      per_page: 200,
      ...params,
    });
  }
}

export default new TeacherService();