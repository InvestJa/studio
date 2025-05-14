import { Icons } from '@/components/icons';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-8 text-primary">
          <Icons.logo className="h-10 w-10 mr-3" />
          <h1 className="text-3xl font-bold">{APP_NAME}</h1>
        </Link>
        <div className="bg-card p-8 rounded-lg shadow-xl">
          {children}
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground space-y-2">
          <p className="font-semibold text-sm text-foreground">InvestJá 2025 $ Soluções Imediatas</p>
          <p>Possuímos uma plataforma online com produtos e serviços ofertados por instituições financeiras parceiras. Nosso prazo de pagamento varia de 1 a 3 meses, a taxa de juros praticada no produto de crédito pessoal é de 12,5% a.m. (310.99% a.a.) até 19.9% a.m. (819% a.a.) e o custo efetivo total (CET) será a partir de 12.82% a.m. (325.31% a.a.). A tarifa de cadastro (TAC) é de R$ 90 até R$ 150.</p>
          <p>Ao solicitar uma proposta, serão exibidos a taxa de juros utilizada, a tarifa, o imposto (IOF) e o custo efetivo total (CET).</p>
          <p>Exemplo: um empréstimo de R$ 1000 em 12 meses com taxa de juros de 12.5% a.m. (310.99% a.a.) terá parcelas de R$ 175.72 e CET de 12.9% a.m. (325.31% a.a.).* <a href="#" className="underline hover:text-primary">Veja termos e condições.</a></p>
        </div>
      </div>
    </div>
  );
}
