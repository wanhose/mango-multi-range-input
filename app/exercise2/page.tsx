import type { Metadata } from 'next';
import { Suspense } from 'react';
import styles from '../page.module.css';
import Loading from '../../components/Loading';
import Logo from '../../components/Logo';
import Range from '../../components/Range';
import fetchData, { RangeFixedData } from '../../utils/fetchData';

export const metadata: Metadata = {
  title: 'Exercise 2',
};

export default async function Exercise2() {
  const data = await fetchData('fixed');
  const values = (data as RangeFixedData).values;

  return (
    <div className={styles.Container}>
      <Logo />
      <Suspense fallback={<Loading />}>
        <Range type={data.type} values={values} />
      </Suspense>
    </div>
  );
}
