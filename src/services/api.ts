import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

export const getTeachers = async () => {
  const teachers = await axios.get('http://localhost:3000/teachers').then(
    response => {return response}
  )
  return teachers;
}

