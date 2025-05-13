import { SignupForm } from '@/components/auth/signup-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cadastro',
  description: 'Crie sua conta no Crédito Simples.',
};

export default function SignupPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
        Crie sua conta
      </h2>
      <SignupForm />
    </>
  );
}
