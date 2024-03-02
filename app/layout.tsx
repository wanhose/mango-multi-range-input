import 'normalize.css/normalize.css';
import type { ReactNode } from 'react';

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export interface LayoutProps {
  readonly children: ReactNode;
}
