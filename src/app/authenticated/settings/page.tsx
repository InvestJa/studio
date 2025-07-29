import type { Metadata } from 'next';
import SettingsLoader from '@/components/settings/settings-loader';

export const metadata: Metadata = {
  title: 'Configurações',
  description: 'Ajuste as configurações da sua aplicação InvestJá.',
};

export default function SettingsPage() {
  return <SettingsLoader />;
}