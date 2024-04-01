import { api } from './api';

export async function getTeachers() {
  const { data } = await api.get('/teachers');
  return data;
}
