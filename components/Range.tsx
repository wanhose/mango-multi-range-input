'use client';

import {
  type JSX,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './Range.module.css';
import CurrencyInput, { CurrencyInputRef } from './CurrencyInput';
import Draggable from './Draggable';

export default function Range(props: RangeProps): JSX.Element {
  const { onChange, step = 1, type = 'range', values } = props;
  const defaultMaxValue = useRef<number>(Math.max(...values));
  const defaultMinValue = useRef<number>(Math.min(...values));
  const maxInputRef = useRef<CurrencyInputRef>(null);
  const minInputRef = useRef<CurrencyInputRef>(null);
  const [maxValue, setMaxValue] = useState<number>(defaultMaxValue.current);
  const [minValue, setMinValue] = useState<number>(defaultMinValue.current);
  const deferredMaxValue = useDeferredValue(maxValue);
  const deferredMinValue = useDeferredValue(minValue);

  const stepToPosition: { readonly [key: number]: number } = useMemo(() => {
    const max = defaultMaxValue.current;
    const min = defaultMinValue.current;
    const result: { [key: number]: number } = {};

    switch (type) {
      case 'fixed': {
        for (const value of values) {
          const percentage = ((value - min) / (max - min)) * 100;
          result[value] = Number(percentage.toFixed(2));
        }
        break;
      }
      case 'range':
      default: {
        for (let i = min; i < max + step; i += step) {
          const percentage = ((i - min) / (max - min)) * 100;
          result[i] = Number(percentage.toFixed(2));
        }
        break;
      }
    }

    return result;
  }, [step, type, values]);

  const handleMaxInputChange = useCallback(
    (value: number) => {
      const nearestIndex = getNearestIndex(value, step);

      setMaxValue(nearestIndex);
    },
    [step],
  );

  const handleMinInputChange = useCallback(
    (value: number) => {
      const nearestIndex = getNearestIndex(value, step);

      setMinValue(nearestIndex);
    },
    [step],
  );

  const handleMaxDrag = useCallback(
    (parentWidth: number, position: number) => {
      const max = defaultMaxValue.current;
      const min = defaultMinValue.current;
      const value = min + (position * (max - min)) / parentWidth;
      const nearestIndex = getNearestIndex(value, step);

      maxInputRef.current?.setValue(nearestIndex);
      setMaxValue(nearestIndex);
    },
    [step],
  );

  const handleMinDrag = useCallback(
    (parentWidth: number, position: number) => {
      const max = defaultMaxValue.current;
      const min = defaultMinValue.current;
      const value = min + (position * (max - min)) / parentWidth;
      const nearestIndex = getNearestIndex(value, step);

      minInputRef.current?.setValue(nearestIndex);
      setMinValue(nearestIndex);
    },
    [step],
  );

  useEffect(() => {
    onChange?.([minValue, maxValue]);
  }, [maxValue, minValue, onChange]);

  return (
    <div className={styles.Container}>
      <CurrencyInput
        data-testid="min-input"
        defaultValue={defaultMinValue.current}
        max={deferredMaxValue}
        min={defaultMinValue.current}
        onChange={handleMinInputChange}
        ref={minInputRef}
      />
      <div className={styles.Input}>
        <Draggable
          data-testid="min-draggable"
          left={stepToPosition[deferredMinValue]}
          max={stepToPosition[deferredMaxValue]}
          min={stepToPosition[defaultMinValue.current]}
          onDrag={handleMinDrag}
        />
        <Draggable
          data-testid="max-draggable"
          max={stepToPosition[defaultMaxValue.current]}
          min={stepToPosition[deferredMinValue]}
          onDrag={handleMaxDrag}
          left={stepToPosition[deferredMaxValue]}
        />
      </div>
      <CurrencyInput
        data-testid="max-input"
        defaultValue={defaultMaxValue.current}
        max={defaultMaxValue.current}
        min={deferredMinValue}
        onChange={handleMaxInputChange}
        ref={maxInputRef}
      />
    </div>
  );
}

function getNearestIndex(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export interface RangeProps {
  /**
   * @description A callback that is called when the range changes
   */
  readonly onChange?: (values: readonly [number, number]) => void;
  /**
   * @description The step of the range
   */
  readonly step?: number;
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
