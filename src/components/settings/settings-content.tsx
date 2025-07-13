"use client";

import * as React from 'react';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
}

export default function SettingsContent() {
  const [location, setLocation] = React.useState<LocationState | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isClient, setIsClient] = React.useState<boolean>(false);
  const { toast } = useToast();

  React.useEffect(() => {
    // Set document title (client-side equivalent of metadata title for this page)
    document.title = "Configurações | InvestJá";
    // Set client flag to true once component mounts on client
    setIsClient(true);
  }, []);

  const handleGetLocation = () => {
    if (!isClient || typeof navigator === 'undefined' || !navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador.");
      toast({
        title: "Erro de Geolocalização",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setLocation(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
        toast({
          title: "Localização Obtida",
          description: "Suas coordenadas foram carregadas.",
        });
      },
      (err) => {
        setError(`Erro ao obter localização: ${err.message}`);
        setIsLoading(false);
        toast({
          title: "Erro ao Obter Localização",
          description: err.message,
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações</h1>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.settings className="mr-2 h-6 w-6 text-primary" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Ajuste as configurações da sua aplicação aqui.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Icons.mapPin className="mr-2 h-5 w-5 text-primary" />
              Rastreamento de Localização
            </h3>
            {isLoading && <p className="text-sm text-muted-foreground">Obtendo localização...</p>}
            {error && (
              <Alert variant="destructive">
                <Icons.warning className="h-4 w-4" />
                <AlertTitle>Erro de Localização</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {location && (
              <div className="p-4 border rounded-md bg-secondary shadow-sm">
                <p className="text-sm font-medium">
                  Latitude: <span className="font-normal text-foreground">{location.latitude?.toFixed(6)}</span>
                </p>
                <p className="text-sm font-medium">
                  Longitude: <span className="font-normal text-foreground">{location.longitude?.toFixed(6)}</span>
                </p>
              </div>
            )}
            {!location && !isLoading && !error && (
                <p className="text-sm text-muted-foreground">Clique no botão abaixo para obter sua localização atual.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleGetLocation} disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.mapPin className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Obtendo..." : (location ? "Atualizar Localização" : "Obter Localização")}
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.bell className="mr-2 h-6 w-6 text-primary" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configurações de notificação (Em desenvolvimento).
          </p>
          <div className="mt-6 flex justify-center">
            <Icons.logo className="h-16 w-16 text-muted opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}