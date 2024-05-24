import { api } from './api';

type TeachersProps = {
  uuidteacher: string;
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
  uuidteacher: string;
  nmteacher: string;
  email: string;
  created_at: string;
  updated_at: string;
  courses: {
    nmcourse: string;
    uuidcourse: string;
  };
};

type NewTeacherProps = {
  nmteacher: string;
  email: string;
  admin: boolean;
};

export async function getTeachers() {
  const { data } = await api.get<TeachersProps[]>('/teachers');

  console.log('data', data);

  return data;
}

export async function getTeacher(uuidteacher: string) {
  const { data } = await api.get<TeacherProps>(`/teachers/${uuidteacher}`);

  console.log('data', data);

  return data;
}

export async function deleteTeacher(uuidteacher: string) {
  const { data } = await api.delete<TeacherProps>(`/teachers/${uuidteacher}`);
  return data;
}

export async function createTeacher(teacher: NewTeacherProps) {
  const { data } = await api.post('/teachers', { ...teacher });

  console.log('data', data);

  return data;
}
