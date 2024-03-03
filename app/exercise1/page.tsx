import type { Metadata } from 'next';
import { Suspense } from 'react';
import styles from '../page.module.css';
import Loading from '../../components/Loading';
import Logo from '../../components/Logo';
import Range from '../../components/Range';
import fetchData, { RangeData } from '../../utils/fetchData';

export const metadata: Metadata = {
  title: 'Exercise 1',
};

export default async function Exercise1() {
  const data = await fetchData('range');
  const values = [(data as RangeData).min, (data as RangeData).max];

  return (
    <div className={styles.Container}>
      <Logo />
      <Suspense fallback={<Loading />}>
        <Range type={data.type} values={values} />
      </Suspense>
    </div>
  );
}
