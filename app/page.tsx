import type { Metadata } from 'next';
import Link from 'next/link';
import type { JSX } from 'react';
import styles from './page.module.css';
import Logo from '../components/Logo';

export const metadata: Metadata = {
  title: 'Home',
};

export default function Page(): JSX.Element {
  return (
    <div className={styles.Container}>
      <Logo />
      <ul className={styles.List}>
        <li>
          <Link href="/exercise1">Exercise 1</Link>
        </li>
        <li>
          <Link href="/exercise2">Exercise 2</Link>
        </li>
      </ul>
    </div>
  );
}
