import { api } from './api';

type CourseProps = {
  uuid?: string;
  nmcourse: string;
  teacherId: string;
  classId: string;
};

export async function getCourses(teacherId: string, isAdmin: boolean, isStudent: boolean) {
  const path = isStudent ? '/student' : '/teacher';

  if (isAdmin) {
    const { data } = await api.get<CourseProps[]>('/course');

    return data;
  } else {   
    const { data } = await api.get<CourseProps[]>(`/course${path}/${teacherId}`);

    return data;
  }
 
}

export async function getCourseById(courseId: string) {
  const { data } = await api.get<CourseProps>(`/course/${courseId}`);

  return data;

}

export async function createCourse(course: CourseProps) {

  await api.post('/course', course);
}

export async function submitAttendance(attendanceData: any) {

  
  await api.post('/classroom/presence', attendanceData);
}

export async function getTeacherByCourse(courseId: string) {
  const { data } = await api.get(`/teachers/course/${courseId}`);

  return data;
}

export async function getStudentsByCourse(courseId: string) {
  const { data } = await api.get(`/student/course/${courseId}`);

  return data;
}

export async function getRollCallByDate(courseId: string, date: Date) {

  const payload = {
    courseId: courseId,
    date: date
  }

  const { data } = await api.post('/checkCall', payload);

  return data;
}


export async function deleteCourse(uuid: string) {
  await api.delete(`/course/${uuid}`);
}