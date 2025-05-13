import { LoginForm } from '@/components/auth/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Acesse sua conta Crédito Simples.',
};

export default function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
        Bem-vindo de volta!
      </h2>
      <LoginForm />
    </>
  );
}
