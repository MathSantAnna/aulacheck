import { api } from './api';

type ClassProps = {
  uuid: string;
  nmclass: string;
  graduarion: number;
  students: any[];
  courses: any[];
};

type CreateClassProps = {
  nmclass: string;
  graduarion: number;
};

export async function getClass() {
  const { data } = await api.get<ClassProps[]>('/class');

  console.log('data', data);

  return data;
}

export async function deleteClass(uuid: string) {
  await api.delete(`/class/${uuid}`);
}

export async function createClass(classData: CreateClassProps) {
  await api.post('/class', classData);
}
