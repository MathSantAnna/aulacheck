import {
  BrowserRouter,
  Route,
  RouteProps,
  Routes as RoutesWrapper,
} from 'react-router-dom';
import { Login } from '../pages/Login';
import { useAuth } from '../hooks/auth';
import { Home } from '../pages/Home';

export const paths = {
  login: '/login',
  home: '/',
};

export function Routes() {
  const { isAuthenticated } = useAuth();

  const authRoutes: RouteProps[] = [
    {
      path: '*',
      element: <Login />,
    },
  ];

  const appRoutes: RouteProps[] = [{ path: paths.home, element: <Home /> }];

  return (
    <BrowserRouter>
      <RoutesWrapper>
        {isAuthenticated ? (
          <Route
            path='/'
            element={<div className='content'>HEADER PADRAO</div>}
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
