import {
  BrowserRouter,
  Outlet,
  Route,
  RouteProps,
  Routes as RoutesWrapper,
} from 'react-router-dom';
import { Login } from '../pages/Login';
import { useAuth } from '../hooks/auth';
import { Header } from '../components/Header';
import { Teachers } from '../pages/Teachers';
import { TeacherDetails } from '../pages/TeacherDetails';
import { Courses } from '../pages/Courses';
import { CourseDetails } from '../pages/CourseDetails';
import { Students } from '../pages/Students';
import { Classes } from '../pages/Classes';
export const paths = {
  login: '/login',
  home: '/',

  teacher: '/professor',
  teacherDetails: '/professor/:uuid',

  course: '/materia',
  courseDetails: '/materia/:uuid',

  class: '/turma',
  classDetails: '/turma/:uuid',

  students: '/aluno',
  studentsDetails: '/aluno/:uuid',
  student: '/aluno',

};

export function Routes() {
  const { isAuthenticated } = useAuth();

  const authRoutes: RouteProps[] = [
    {
      path: '*',
      element: <Login />,
    },
  ];

  const appRoutes: RouteProps[] = [
    { path: paths.home, element: <Teachers /> },
    { path: paths.teacher, element: <Teachers /> },
    { path: paths.teacherDetails, element: <TeacherDetails /> },

    {
      path: paths.course,
      element: <Courses />,
    },
    {
      path: paths.courseDetails,
      element: <CourseDetails />,
    },
    { path: paths.student, element: <Students />},
    { path: paths.class, element: <Classes />},
  ];

  return (
    <BrowserRouter>
      <RoutesWrapper>
        {isAuthenticated ? (
          <Route
            path='/'
            element={
              <>
                <Header />
                <Outlet />
              </>
            }
          >
            {appRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        ) : (
          authRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))
        )}
      </RoutesWrapper>
    </BrowserRouter>
  );
}
