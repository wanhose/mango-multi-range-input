import type { JSX } from 'react';
import fetchData from '../utils/fetchData';

export default async function Range(props: RangeProps): Promise<JSX.Element> {
  const { type = 'range' } = props;
  const data = await fetchData(type);

  return <p>{JSON.stringify(data)}</p>;
}

export interface RangeProps {
  /**
   * @description The type of range to display
   * @default 'range'
   */
  readonly type?: 'fixed' | 'range';
}
