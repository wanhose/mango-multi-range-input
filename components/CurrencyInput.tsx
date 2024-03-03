'use client';

import {
  type JSX,
  ChangeEvent,
  HTMLAttributes,
  FocusEvent,
  useCallback,
} from 'react';
import styles from './CurrencyInput.module.css';

export default function CurrencyInput(props: CurrencyInputProps): JSX.Element {
  const { defaultValue, max, min, onChange, ...rest } = props;

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLSpanElement>) => {
      const textContent = event.currentTarget.textContent?.trim();
      const value = Number(textContent);

      if (defaultValue && (textContent === '' || min > value || max < value)) {
        event.currentTarget.innerHTML = `${defaultValue}`;
      } else if (!isNaN(value)) {
        event.currentTarget.innerHTML = `${value}`;
      }
    },
    [defaultValue, max, min],
  );

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLSpanElement>) => {
      const textContent = event.currentTarget.textContent?.trim();
      const value = Number(textContent);

      if (!Number.isNaN(value) && min <= value && max >= value) {
        onChange?.(value);
      }
    },
    [max, min, onChange],
  );

  return (
    <div className={styles.Container}>
      <span
        className={styles.Input}
        contentEditable
        onBlur={handleBlur}
        onInput={handleInput}
        role="textbox"
        suppressContentEditableWarning
        {...rest}
      >
        {defaultValue}
      </span>
      €
    </div>
  );
}

export interface CurrencyInputProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'onBlur' | 'onChange'> {
  readonly max: number;
  readonly min: number;
  readonly onChange: (value: number) => void;
}
