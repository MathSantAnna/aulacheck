import { Routes } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './hooks/auth';

import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/main.scss';

import './styles/custom/custom.scss';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
