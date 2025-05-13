import type { Metadata } from 'next';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Configurações',
  description: 'Ajuste as configurações da sua aplicação Crédito Simples.',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações</h1>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.settings className="mr-2 h-6 w-6 text-primary" />
            Em Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A página de configurações está atualmente em desenvolvimento.
            Aqui você poderá personalizar as opções da sua aplicação.
          </p>
          <div className="mt-6 flex justify-center">
            <Icons.logo className="h-24 w-24 text-muted opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
