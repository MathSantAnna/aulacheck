import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button, Card, CardBody } from 'reactstrap';

import { DefaultInput } from '../components/DefaultInput';

import { useAuth } from '../hooks/auth';
import { login } from '../services/auth';
import { SignInProps } from '../types/user';

import { paths } from '../routes';

import '../styles/pages/login.scss';

export function Login() {
  const navigation = useNavigate();
  const { onLoginSuccess } = useAuth();
  const { control, handleSubmit } = useForm<SignInProps>();

  const loginMutation = useMutation({
    mutationKey: ['LOGIN'],
    mutationFn(params: SignInProps) {
      return login(params);
    },
    onSuccess(res) {
      onLoginSuccess(res.data);
      navigation(paths.home);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    loginMutation.mutate(data);
  });

  return (
    <div
      className='w-100 d-flex align-items-center justify-content-center'
      style={{ height: '100vh' }}
    >
      <Card className='shadow-sm bg-white'>
        <CardBody>
          <form
            onSubmit={onSubmit}
            className='login-form d-flex flex-column align-items-center justify-content-center gap-3 p-3'
          >
            {loginMutation.error?.message && (
              <p className='error-message'>{loginMutation.error?.message}</p>
            )}
            <DefaultInput
              control={control}
              label='E-mail'
              name='email'
              type='email'
              rules={{ required: 'Informe um e-mail' }}
            />
            <DefaultInput
              control={control}
              label='Senha'
              name='password'
              type='password'
              rules={{ required: 'Informe uma senha' }}
            />
            <Button
              className='w-100 mt-2'
              color='primary'
              disabled={loginMutation.isPending}
            >
              Entrar
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
