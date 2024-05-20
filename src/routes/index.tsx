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

export const paths = {
  login: '/login',
  home: '/',

  teacher: '/professor',
  teacherDetails: '/professor/:uuid',
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
    { path: paths.teacherDetails, element: <TeacherDetails /> },
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
