import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

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
        <body>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}