import type { Metadata } from 'next';
import styles from '../page.module.css';
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
      <Range type={data.type} values={values} />
    </div>
  );
}
