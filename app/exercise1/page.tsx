import type { Metadata } from 'next';
import styles from '../page.module.css';
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
      <Range type={data.type} values={values} />
    </div>
  );
}
