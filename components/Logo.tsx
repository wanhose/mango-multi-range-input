import Image from 'next/image';
import type { JSX } from 'react';

export default function Logo(): JSX.Element {
  return (
    <Image
      alt="Mango Logo"
      height={53}
      priority
      src="/images/logo.svg"
      width={320}
    />
  );
}
