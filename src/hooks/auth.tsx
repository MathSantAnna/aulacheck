import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserProps } from '../types/user';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { compareAsc } from 'date-fns';
import { paths } from '../routes';
import { api } from '../services/api';

type ContextProps = Partial<UserProps> & {
  isAuthenticated: boolean;
  loggedUser: any;
  isAdmin?: boolean;
  isStudent?: boolean;

  logOut(): void;
  onLoginSuccess(props: UserProps): void;
};

const Context = createContext({} as ContextProps);

export const AuthProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<UserProps>();

  const onLoginSuccess = useCallback(async (props: UserProps) => {
    setUser(props);
    localStorage.setItem('user', JSON.stringify(props));
    api.defaults.headers.common.Authorization = `Bearer ${props.token}`;
  }, []);

  const logOut = () => {
    setUser(undefined);
    localStorage.clear();
  };

  useEffect(() => {
    const storagedUser = localStorage.getItem('user');

    if (storagedUser) {
      const userObj = JSON.parse(storagedUser);
      if (userObj) {
        const { exp } = jwtDecode(userObj.token) as JwtPayload;

        if (compareAsc(Number(exp) * 1000, new Date()) === 1) {
          setUser(userObj);
          api.defaults.headers.common.Authorization = `Bearer ${userObj.token}`;
        } else {
          localStorage.clear();
          window.location.replace(paths.login);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const isAdmin = user && user.admin
  const isStudent = user && !!user.nmstudent

  if (isLoading) {
    return <>Carregando...</>;
  }

  return (
    <Context.Provider
      value={{ ...user, isAdmin: isAdmin, isStudent: isStudent, isAuthenticated: !!user, onLoginSuccess, logOut, loggedUser: user }}
    >
      {children}
    </Context.Provider>
  );
};

export function useAuth() {
  const context = useContext(Context);

  if (!context) throw new Error('useAuth must be used within AuthProvider');

  return context;
}