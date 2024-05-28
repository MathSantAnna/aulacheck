import { api } from './api';

type ClassProps = {
    uuid: string
    nmclass: string
    graduarion: number
    students: any[]
    courses: any[]
};


export async function getClass() {
  const { data } = await api.get<ClassProps>('/class');

  console.log('data', data);

  return data;
}
