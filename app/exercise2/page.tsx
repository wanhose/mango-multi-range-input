import type { Metadata } from 'next';
import { Suspense } from 'react';
import styles from '../page.module.css';
import Loading from '../../components/Loading';
import Logo from '../../components/Logo';
import Range from '../../components/Range';

export const metadata: Metadata = {
  title: 'Exercise 2',
};

export default function Exercise2() {
  return (
    <div className={styles.Container}>
      <Logo />
      <Suspense fallback={<Loading />}>
        <Range type="fixed" />
      </Suspense>
    </div>
  );
}
