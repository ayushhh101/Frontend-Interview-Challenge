import './globals.css'; 
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hospital Appointment Scheduler',
  description: 'Frontend interview challenge - Doctor appointment scheduling system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
