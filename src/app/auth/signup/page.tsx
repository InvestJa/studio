import { SignupForm } from '@/components/auth/signup-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar Conta',
  description: 'Crie uma nova conta para começar a usar o Crédito Simples.',
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