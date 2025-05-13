import { redirect } from 'next/navigation';

export default function HomePage() {
  // Middleware will handle authentication and redirect to /login if not authenticated
  // If authenticated, middleware allows access, and this page redirects to /dashboard
  // Or, if middleware redirects unauth / to /login, this can simply go to /dashboard
  redirect('/dashboard');
  // return null; // Or a loading spinner, but redirect is cleaner
}
