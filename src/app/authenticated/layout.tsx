import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-screen bg-secondary">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <footer className="p-4 md:p-6 lg:p-8 border-t border-border bg-card">
          <div className="max-w-screen-xl mx-auto text-xs text-muted-foreground space-y-2 text-left">
            <p className="font-semibold text-sm text-foreground">InvestJá 2025 $ Soluções Imediatas</p>
            <p>Possuímos uma plataforma online com produtos e serviços ofertados por instituições financeiras parceiras. Nosso prazo de pagamento varia de 1 a 3 meses, a taxa de juros praticada no produto de crédito pessoal é de 12,5% a.m. (310.99% a.a.) até 19.9% a.m. (819% a.a.) e o custo efetivo total (CET) será a partir de 12.82% a.m. (325.31% a.a.). A tarifa de cadastro (TAC) é de R$ 90 até R$ 150.</p>
            <p>Ao solicitar uma proposta, serão exibidos a taxa de juros utilizada, a tarifa, o imposto (IOF) e o custo efetivo total (CET).</p>
            <p>Exemplo: um empréstimo de R$ 1000 em 12 meses com taxa de juros de 12.5% a.m. (310.99% a.a.) terá parcelas de R$ 175.72 e CET de 12.9% a.m. (325.31% a.a.).* <a href="#" className="underline hover:text-primary">Veja termos e condições.</a></p>
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
}
