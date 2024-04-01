import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

export const getTeachers = async () => {
  const teachers = await axios.get('https://aulacheck.onrender.com/teachers').then(
    response => {return response}
  )
  return teachers;
}

