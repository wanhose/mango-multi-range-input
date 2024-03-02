import { RangeProps } from '../components/Range';
import environment from './environment';

export default async function fetchData(
  type: RangeProps['type'],
): Promise<RangeData | RangeFixedData> {
  const baseUrl = environment.baseUrl;

  if (type === 'fixed') {
    return fetch(`${baseUrl}/api/range/fixed`).then((res) => res.json());
  }

  return fetch(`${baseUrl}/api/range`).then((res) => res.json());
}

export interface RangeData {
  readonly type: 'range';
  readonly min: number;
  readonly max: number;
}

export interface RangeFixedData {
  readonly type: 'fixed';
  readonly values: readonly number[];
}
