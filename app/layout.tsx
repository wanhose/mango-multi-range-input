import '../styles/normalize.css';
import '../styles/global.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400'],
});

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

export interface LayoutProps {
  readonly children: ReactNode;
}
