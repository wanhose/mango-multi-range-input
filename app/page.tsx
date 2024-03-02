import { Suspense } from 'react';
import Logo from '../components/Logo';
import Range from '../components/Range';
import styles from './page.module.css';
import Loading from '../components/Loading';

export default function Page() {
  return (
    <div className={styles.Container}>
      <Logo />
      <Suspense fallback={<Loading />}>
        <Range type="range" />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <Range type="fixed" />
      </Suspense>
    </div>
  );
}
