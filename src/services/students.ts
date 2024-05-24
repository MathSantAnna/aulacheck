import { api } from './api';

type StudentsProps = {
  uuid: string;
  nmstudent: string;
  email: string;
  enrollmentDate: string;
  created_at: string;
  updated_at: string;
};

type StudentProps = {
  uuid: string;
  nmstudent: string;
  email: string;
  enrollmentDate: string;
  created_at: string;
  updated_at: string;
};

export async function getStudents() {
  const { data } = await api.get<StudentsProps>('/student');

  console.log('data', data);

  return data;
}

export async function getStudent(uuid: string) {
  const { data } = await api.get<StudentProps>(`/student/${uuid}`);

  console.log('data', data);

  return data;
}


