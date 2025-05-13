import type { Metadata } from 'next';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Pagamentos',
  description: 'Gerencie e acompanhe os pagamentos dos seus clientes.',
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Pagamentos</h1>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.payments className="mr-2 h-6 w-6 text-primary" />
            Em Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A funcionalidade de gerenciamento de pagamentos está atualmente em desenvolvimento.
            Volte em breve para conferir as novidades!
          </p>
          <div className="mt-6 flex justify-center">
            <Icons.settings className="h-24 w-24 text-muted animate-spin-slow" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add spin-slow to tailwind.config.ts if not present, or use animate-spin
// For now, using animate-spin.
// If custom animation is desired:
// tailwind.config.ts -> theme.extend.animation: { 'spin-slow': 'spin 3s linear infinite' }
