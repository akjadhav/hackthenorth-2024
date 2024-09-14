import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  json,
} from '@remix-run/react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { useState } from 'react';
import type { LinksFunction } from '@remix-run/node';

import './tailwind.css';
// import './global.css';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: 'global.css' },
];

export async function loader() {
  const CONVEX_URL = process.env['CONVEX_URL'];
  if (!CONVEX_URL) {
    throw new Error('CONVEX_URL is not defined in environment variables');
  }
  return json({ ENV: { CONVEX_URL } });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const ENV = data?.ENV || {
    CONVEX_URL: 'https://accurate-echidna-179.convex.cloud',
  };

  const [convex] = useState(() => new ConvexReactClient(ENV.CONVEX_URL));

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <Meta />
        <Links />
      </head>
      <body>
        <ConvexProvider client={convex}>{children}</ConvexProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
