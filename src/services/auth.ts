import { api } from './api';
import { ResponseProps } from '../types/common';
import { SignInProps, UserProps } from '../types/user';

type AuthResponse = ResponseProps<UserProps>;

export async function login(params: SignInProps) {
  console.log('params', params);

  const { data } = await api.post<AuthResponse>('/auth', params);

  return data;
}
