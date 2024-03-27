import { ResponseProps } from '../types/common';
import { SignInProps, UserProps } from '../types/user';
import { api } from './api';

type AuthResponse = ResponseProps<UserProps>;

export async function login(params: SignInProps) {
  const { data } = await api.post<AuthResponse>('/api/auth', params);

  return data;
}
