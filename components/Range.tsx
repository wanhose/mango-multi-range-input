'use client';

import { type JSX, useEffect, useRef, useState } from 'react';
import styles from './Range.module.css';
import CurrencyInput from './CurrencyInput';
import Draggable from './Draggable';

export default function Range(props: RangeProps): JSX.Element {
  const { onChange, type = 'range', values } = props;
  const defaultMaxValue = useRef<number>(Math.max(...values));
  const defaultMinValue = useRef<number>(Math.min(...values));
  const [maxValue, setMaxValue] = useState<number>(defaultMaxValue.current);
  const [minValue, setMinValue] = useState<number>(defaultMinValue.current);

  useEffect(() => {
    onChange?.([minValue, maxValue]);
  }, [maxValue, minValue, onChange]);

  return (
    <div className={styles.Container}>
      <CurrencyInput
        defaultValue={defaultMinValue.current}
        max={defaultMaxValue.current}
        min={defaultMinValue.current}
        onChange={setMinValue}
      />
      <div className={styles.Input}>
        <Draggable />
        <Draggable />
      </div>
      <CurrencyInput
        defaultValue={defaultMaxValue.current}
        max={defaultMaxValue.current}
        min={defaultMinValue.current}
        onChange={setMaxValue}
      />
    </div>
  );
}

export interface RangeProps {
  /**
   * @description A callback that is called when the range changes
   */
  readonly onChange?: (values: readonly [number, number]) => void;
  /**
   * @description The type of range to display
   * @default 'range'
   */
  readonly type?: 'fixed' | 'range';
  /**
   * @description The values of the range, used as steps when type is 'fixed'
   */
  readonly values: readonly number[];
}
