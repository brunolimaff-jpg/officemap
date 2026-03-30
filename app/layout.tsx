import type { Metadata } from 'next';
import { Press_Start_2P, JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Habbo Hotel — AI Agents',
  description: 'Um Habbo Hotel com agentes de IA — escritório virtual de Bruno Lima.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="bg-slate-950 text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
