import CourseService from './CourseService';
import TaskService from './TaskService';

class TeacherService {
  async courses(params = {}) {
    return CourseService.paginate(params);
  }

  async courseDetail(courseId) {
    return CourseService.find(courseId);
  }

  async courseTasks(courseId, params = {}) {
    return TaskService.paginate({
      course_id: courseId,
      ...params,
    });
  }

  async createTask(payload) {
    return TaskService.create(payload);
  }

  async updateTask(taskId, payload) {
    return TaskService.update(taskId, payload);
  }

  async deleteTask(taskId) {
    return TaskService.delete(taskId);
  }
}

export default new TeacherService();