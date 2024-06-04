import { api } from './api';

type CourseProps = {
  uuid?: string;
  nmcourse: string;
  teacherId: string;
  classId: string;
};

export async function getCourses() {
  const { data } = await api.get<CourseProps[]>('/course');

  console.log('data', data);

  return data;
}

export async function getCourseById(courseId: string) {
  const { data } = await api.get<CourseProps>(`/course/${courseId}`);

  return data;

}

export async function createCourse(course: CourseProps) {
  console.log(course);
  
  await api.post('/course', course);
}

export async function getTeacherByCourse(courseId: string) {
  const { data } = await api.get(`/teachers/course/${courseId}`);

  return data;
}

export async function getStudentsByCourse(courseId: string) {
  console.log('shausha');
  const { data } = await api.get(`/student/course/${courseId}`);

  return data;
}
