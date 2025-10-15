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
    <html lang="en" className="transition-colors">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent flash of unstyled content
              (function() {
                const theme = localStorage.getItem('darkMode');
                if (theme === 'true' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
