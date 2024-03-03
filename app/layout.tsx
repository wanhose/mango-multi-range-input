import '../styles/normalize.css';
import '../styles/global.css';
import { Inter } from 'next/font/google';
import { type ReactNode, Suspense } from 'react';
import Loading from '../components/Loading';

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
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  );
}

export interface LayoutProps {
  readonly children: ReactNode;
}
