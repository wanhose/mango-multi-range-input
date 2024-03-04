'use client';

import {
  type JSX,
  KeyboardEvent,
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
  const [lastDraggable, setLastDraggable] = useState<'min' | 'max'>('max');
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

  const handleMaxInputBlur = useCallback(
    (value: number) => {
      const nearestIndex =
        type === 'fixed'
          ? getNearestIndexOnValues(value, values)
          : getNearestIndex(value, step);

      maxInputRef.current?.setValue(nearestIndex);
      setLastDraggable('max');
      setMaxValue(nearestIndex);
    },
    [step, type, values],
  );

  const handleMinInputBlur = useCallback(
    (value: number) => {
      const nearestIndex =
        type === 'fixed'
          ? getNearestIndexOnValues(value, values)
          : getNearestIndex(value, step);

      minInputRef.current?.setValue(nearestIndex);
      setLastDraggable('min');
      setMinValue(nearestIndex);
    },
    [step, type, values],
  );

  const handleMaxInputChange = useCallback(
    (value: number) => {
      const nearestIndex =
        type === 'fixed'
          ? getNearestIndexOnValues(value, values)
          : getNearestIndex(value, step);

      setLastDraggable('max');
      setMaxValue(nearestIndex);
    },
    [step, type, values],
  );

  const handleMinInputChange = useCallback(
    (value: number) => {
      const nearestIndex =
        type === 'fixed'
          ? getNearestIndexOnValues(value, values)
          : getNearestIndex(value, step);

      setLastDraggable('min');
      setMinValue(nearestIndex);
    },
    [step, type, values],
  );

  const handleMaxDrag = useCallback(
    (parentWidth: number, position: number) => {
      const max = defaultMaxValue.current;
      const min = defaultMinValue.current;
      const value = min + (position * (max - min)) / parentWidth;
      const nearestIndex =
        type === 'fixed'
          ? getNearestIndexOnValues(value, values)
          : getNearestIndex(value, step);

      maxInputRef.current?.setValue(nearestIndex);
      setLastDraggable('max');
      setMaxValue(nearestIndex);
    },
    [step, type, values],
  );

  const handleMinDrag = useCallback(
    (parentWidth: number, position: number) => {
      const max = defaultMaxValue.current;
      const min = defaultMinValue.current;
      const value = min + (position * (max - min)) / parentWidth;
      const nearestIndex =
        type === 'fixed'
          ? getNearestIndexOnValues(value, values)
          : getNearestIndex(value, step);

      minInputRef.current?.setValue(nearestIndex);
      setLastDraggable('min');
      setMinValue(nearestIndex);
    },
    [step, type, values],
  );

  const handleMaxKeyDown = useCallback(
    (event: KeyboardEvent<HTMLSpanElement>) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        const nextIndex =
          type === 'fixed'
            ? getNextIndexOnValues(maxValue, values, defaultMaxValue.current)
            : getNextIndex(maxValue, step, defaultMaxValue.current);

        if (typeof nextIndex === 'number') {
          maxInputRef.current?.setValue(nextIndex);
          setMaxValue(nextIndex);
        }
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        const previousIndex =
          type === 'fixed'
            ? getPreviousIndexOnValues(maxValue, values, minValue)
            : getPreviousIndex(maxValue, step, minValue);

        if (typeof previousIndex === 'number') {
          maxInputRef.current?.setValue(previousIndex);
          setMaxValue(previousIndex);
        }
      }
    },
    [maxValue, minValue, step, type, values],
  );

  const handleMinKeyDown = useCallback(
    (event: KeyboardEvent<HTMLSpanElement>) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        const nextIndex =
          type === 'fixed'
            ? getNextIndexOnValues(minValue, values, maxValue)
            : getNextIndex(minValue, step, maxValue);

        if (typeof nextIndex === 'number') {
          minInputRef.current?.setValue(nextIndex);
          setMinValue(nextIndex);
        }
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        const previousIndex =
          type === 'fixed'
            ? getPreviousIndexOnValues(
                minValue,
                values,
                defaultMinValue.current,
              )
            : getPreviousIndex(minValue, step, defaultMinValue.current);

        if (typeof previousIndex === 'number') {
          minInputRef.current?.setValue(previousIndex);
          setMinValue(previousIndex);
        }
      }
    },
    [maxValue, minValue, step, type, values],
  );

  useEffect(() => {
    onChange?.([minValue, maxValue]);
  }, [maxValue, minValue, onChange]);

  return (
    <div className={styles.Container}>
      <CurrencyInput
        data-testid="min-input"
        defaultValue={defaultMinValue.current}
        id="min-input"
        max={deferredMaxValue}
        min={defaultMinValue.current}
        onBlur={handleMinInputBlur}
        onChange={handleMinInputChange}
        ref={minInputRef}
      />
      <div className={styles.Input}>
        <Draggable
          aria-labelledby="min-input"
          aria-valuemax={stepToPosition[deferredMaxValue]}
          aria-valuemin={stepToPosition[defaultMinValue.current]}
          aria-valuenow={deferredMinValue}
          data-testid="min-draggable"
          left={stepToPosition[deferredMinValue]}
          max={stepToPosition[deferredMaxValue]}
          min={stepToPosition[defaultMinValue.current]}
          onDrag={handleMinDrag}
          onKeyDown={handleMinKeyDown}
          role="slider"
          style={{ zIndex: lastDraggable === 'min' ? 1 : 0 }}
        />
        <Draggable
          aria-labelledby="max-input"
          aria-valuemax={stepToPosition[defaultMaxValue.current]}
          aria-valuemin={stepToPosition[deferredMinValue]}
          aria-valuenow={deferredMaxValue}
          data-testid="max-draggable"
          max={stepToPosition[defaultMaxValue.current]}
          min={stepToPosition[deferredMinValue]}
          onDrag={handleMaxDrag}
          onKeyDown={handleMaxKeyDown}
          left={stepToPosition[deferredMaxValue]}
          role="slider"
          style={{ zIndex: lastDraggable === 'max' ? 1 : 0 }}
        />
      </div>
      <CurrencyInput
        data-testid="max-input"
        defaultValue={defaultMaxValue.current}
        id="max-input"
        max={defaultMaxValue.current}
        min={deferredMinValue}
        onBlur={handleMaxInputBlur}
        onChange={handleMaxInputChange}
        ref={maxInputRef}
      />
    </div>
  );
}

function getNearestIndexOnValues(
  value: number,
  values: readonly number[],
): number {
  let nearest = [...values].sort()[0];
  let diff = Math.abs(value - nearest);

  for (let i = 1; i < values.length; i++) {
    const newDiff = Math.abs(value - values[i]);

    if (newDiff < diff) {
      nearest = values[i];
      diff = newDiff;
    }
  }

  return nearest;
}

function getNearestIndex(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function getNextIndex(
  value: number,
  step: number,
  max: number,
): number | undefined {
  const nextValue = value + step;

  return nextValue <= max ? nextValue : undefined;
}

function getNextIndexOnValues(
  value: number,
  values: readonly number[],
  max: number,
): number | undefined {
  const sortedValues = [...values].sort((a, b) => a - b);
  const currentIndex = sortedValues.indexOf(value);
  const nextIndex =
    currentIndex < sortedValues.length - 1
      ? sortedValues[currentIndex + 1]
      : undefined;

  return typeof nextIndex === 'number' && nextIndex <= max
    ? nextIndex
    : undefined;
}

function getPreviousIndex(
  value: number,
  step: number,
  min: number,
): number | undefined {
  const previousValue = value - step;

  return previousValue >= min ? previousValue : undefined;
}

function getPreviousIndexOnValues(
  value: number,
  values: readonly number[],
  min: number,
): number | undefined {
  const sortedValues = [...values].sort((a, b) => a - b);
  const currentIndex = sortedValues.indexOf(value);
  const previousIndex =
    currentIndex > 0 ? sortedValues[currentIndex - 1] : undefined;

  return typeof previousIndex === 'number' && previousIndex >= min
    ? previousIndex
    : undefined;
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
