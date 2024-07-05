import type { Metadata } from 'next';
import '@/styles/globals.css';
import { TooltipProvider } from '@radix-ui/react-tooltip';

export const metadata: Metadata = {
  title: 'Statusly',
  description: 'Monitor your services and get notified when they go down.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex h-full min-h-screen-small w-full flex-col items-start justify-center`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
