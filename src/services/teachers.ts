import { api } from './api';

type TeachersProps = {
  uuid: string;
  nmteacher: string;
  email: string;
  password: string;
  created_at: string;
  admin: boolean;
  updated_at: string;
};

type TeacherProps = {
  uuid: string;
  nmteacher: string;
  email: string;
  password: string;
  created_at: string;
  admin: boolean;
  updated_at: string;
};

type NewTeacherProps = {
  nmteacher: string;
  email: string;
  admin: boolean;
  password: string;
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

export async function updateTeacher(
  uuidteacher: string,
  teacher: NewTeacherProps
) {
  const { data } = await api.put(`/teachers/${uuidteacher}`, { ...teacher });

  console.log('data', data);

  return data;
}
