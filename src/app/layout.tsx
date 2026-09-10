import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WorkSim — Practice Work, Not Courses | AI Workplace Simulation',
  description:
    'Experience real workplace simulations with autonomous AI coworkers, live production incidents, simulated terminal environments, and automated skill evaluations.',
  keywords: [
    'workplace simulation',
    'AI edtech',
    'developer training',
    'software engineering practice',
    'AI coworkers',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#fafafa] font-sans antialiased selection:bg-[#c40505]/30 selection:text-white">
        <TooltipProvider delay={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
