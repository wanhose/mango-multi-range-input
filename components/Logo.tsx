import Image from 'next/image';
import React from 'react';

export default function Logo(): React.JSX.Element {
  return (
    <Image alt="Mango Logo" height={53} src="/images/logo.svg" width={320} />
  );
}
