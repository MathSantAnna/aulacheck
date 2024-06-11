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

type NewStudentProps = {
  nmstudent: string;
  email: string;
  parentemail: string;
  classId: string;
  password: string;
};

export async function getStudents() {
  const { data } = await api.get<StudentsProps>('/student');

  return data;
}

export async function getStudent(uuid: string) {
  const { data } = await api.get<StudentProps>(`/student/${uuid}`);

  return data;
}

export async function deleteStudent(uuid: string) {
  const { data } = await api.delete<StudentProps>(`/student/${uuid}`);
  return data;
}

export async function createStudent(student: NewStudentProps) {
  const { data } = await api.post('/student', { ...student });

  return data;
}

export async function getStudentsByClass(classId: string) {
  const { data } = await api.get<StudentsProps[]>(`/student/class/${classId}`);

  return data;
}

export async function updateStudent(uuid: string, student: NewStudentProps) {
  const { data } = await api.patch(`/student/${uuid}`, { ...student });

  return data;
}
