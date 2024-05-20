import { api } from './api';

type CourseProps = {
  uuid: string;
  nmcourse: string;
  teacherId: string;
  classId: string;
};

export async function getCourses() {
  const { data } = await api.get<CourseProps[]>('/course');

  console.log('data', data);

  return data;
}
