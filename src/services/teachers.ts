import { api } from './api';

type TeachersProps = {
  uuid: string;
  nmteacher: string;
  email: string;
  created_at: string;
  updated_at: string;
  courses: {
    nmcourse: string;
    uuidcourse: string;
  }[];
};

type TeacherProps = {
  uuid: string;
  nmteacher: string;
  email: string;
  created_at: string;
  updated_at: string;
  courses: {
    nmcourse: string;
    uuidcourse: string;
  };
};

export async function getTeachers() {
  const { data } = await api.get<TeachersProps[]>('/teachers');

  console.log('data', data);

  return data;
}

export async function getTeacher(uuid: string) {
  const { data } = await api.get<TeacherProps>(`/teachers/${uuid}`);

  console.log('data', data);

  return data;
}
