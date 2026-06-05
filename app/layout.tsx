import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SeiFlux',
  description: 'Powering open-source collaboration on Sei.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ThemeProvider>
  );
}