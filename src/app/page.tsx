export default function HomePage() {
  // Middleware handles all authentication and redirection logic
  // This page should never be reached due to middleware redirects
  // Return a minimal valid JSX element to allow proper prerendering
  return <div></div>;
}