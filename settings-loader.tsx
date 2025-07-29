'use client';

import dynamic from 'next/dynamic';

// This component acts as a client-side wrapper to dynamically import
// the main SettingsContent. Using `ssr: false` is only allowed in
// Client Components, so we've moved this logic out of the main page.
const SettingsContent = dynamic(
  () => import('@/components/settings/settings-content'),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Configurações
          </h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    ),
  }
);

export default function SettingsLoader() {
  return <SettingsContent />;
}