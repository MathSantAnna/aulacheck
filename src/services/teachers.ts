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

export type NewTeacherProps = {
  nmteacher: string;
  email: string;
  admin: boolean;
  password: string;
};

export async function getTeachers() {
  const { data } = await api.get<TeachersProps[]>('/teachers');

  return data;
}

export async function getTeacher(uuidteacher: string) {
  const { data } = await api.get<TeacherProps>(`/teachers/${uuidteacher}`);

  return data;
}

export async function deleteTeacher(uuidteacher: string) {
  const { data } = await api.delete<TeacherProps>(`/teachers/${uuidteacher}`);
  return data;
}

export async function createTeacher(teacher: Partial<NewTeacherProps>) {
  const { data } = await api.post('/teachers', { ...teacher });

  return data;
}

export async function updateTeacher(
  uuidteacher: string,
  teacher: NewTeacherProps
) {
  const { data } = await api.put(`/teachers/${uuidteacher}`, { ...teacher });

  return data;
}
