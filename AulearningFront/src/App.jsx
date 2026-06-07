import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </UIProvider>
  );
}