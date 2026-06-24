import DashboardService from './DashboardService';
import CourseService from './CourseService';
import TaskService from './TaskService';
import DeliverTaskService from './DeliverTaskService';
import FileService from './FileService';

class StudentService {
  async dashboard() {
    return DashboardService.student();
  }

  async courses(studentId, params = {}) {
    return CourseService.paginate({
      student_id: studentId,
      ...params,
    });
  }

  async courseDetail(courseId) {
    return CourseService.find(courseId);
  }

  async courseTasks(courseId, params = {}) {
    return TaskService.getByCourse(courseId, params);
  }

  async tasks(params = {}) {
    return TaskService.paginate(params);
  }

  async deliveries(params = {}) {
    return DeliverTaskService.paginate(params);
  }

  async createDelivery(payload) {
    return DeliverTaskService.create(payload);
  }

  async updateDelivery(id, payload) {
    return DeliverTaskService.update(id, payload);
  }

  async materials(params = {}) {
    return FileService.paginate(params);
  }

  async courseMaterials(courseId, params = {}) {
    return FileService.paginate({
      course_id: courseId,
      ...params,
    });
  }

  async grades(studentId, params = {}) {
    return DeliverTaskService.getByStudent(studentId, {
      status: 'graded',
      ...params,
    });
  }
}

export default new StudentService();