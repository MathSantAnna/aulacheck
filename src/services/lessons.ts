import { api } from './api';

type LessonsProps = {
  uuidlesson: string;
  nmlesson: string;
  email: string;
  created_at: string;
  updated_at: string;
  courses: {
    nmcourse: string;
    uuidcourse: string;
  }[];
};

export async function getLessons() {
  const { data } = await api.get<LessonsProps[]>('/lessons');

  console.log('data', data);

  return data;
}
