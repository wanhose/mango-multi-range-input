import Logo from '../components/Logo';
import styles from './page.module.css';

export default function Page() {
  return (
    <div className={styles.Container}>
      <Logo />
    </div>
  );
}
