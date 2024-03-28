import { ResponseProps } from '../types/common';
import { SignInProps, UserProps } from '../types/user';

type AuthResponse = ResponseProps<UserProps>;

export async function login(params: SignInProps) {
  console.log('params', params);

  // const { data } = await api.post<AuthResponse>('/api/auth', params);
  // return data;

  const data = {
    data: {
      created_at: '2024-03-27 08:00:00',
      email: 'matheus@teste.com',
      nmuser: 'Matheus Miranda Ferreira',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3NjY2MjA4MDAwMDB9.Kod3Ijw_lNIv9fjbb5IwRxhn-QR5nVCokD8VZucxmP4',
      updated_at: '2024-03-27 08:00:00',
      uuiduser: '3919156b-a2f5-4c5f-b18a-5dabb715663c',
    },
    status: '00',
  } as AuthResponse;

  return data;
}
