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

export async function getTeachers() {
  const { data } = await api.get<TeachersProps[]>('/teachers');

  console.log('data', data);

  return data;
}
