/* eslint-disable react/display-name */

'use client';

import React, {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  HTMLAttributes,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import styles from './CurrencyInput.module.css';

const CurrencyInput = forwardRef<CurrencyInputRef, CurrencyInputProps>(
  (props, ref) => {
    const { defaultValue, max, min, onBlur, onChange, ...rest } = props;
    const inputRef = useRef<HTMLSpanElement>(null);

    useImperativeHandle(ref, () => ({
      setValue: (value: number) => {
        if (inputRef.current) {
          inputRef.current.innerHTML = `${value}`;
        }
      },
    }));

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLSpanElement>) => {
        const textContent = event.currentTarget.textContent?.trim();
        const value = Number(textContent);

        if (isNaN(value) || textContent === '') {
          event.currentTarget.innerHTML = `${defaultValue}`;
          onBlur?.(defaultValue);
        } else if (min > value) {
          event.currentTarget.innerHTML = `${min}`;
          onBlur?.(min);
        } else if (max < value) {
          event.currentTarget.innerHTML = `${max}`;
          onBlur?.(max);
        } else {
          event.currentTarget.innerHTML = `${value}`;
          onBlur?.(value);
        }
      },
      [defaultValue, max, min, onBlur],
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
          ref={inputRef}
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
  },
);

export default CurrencyInput;

export interface CurrencyInputProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    'defaultValue' | 'onBlur' | 'onChange'
  > {
  readonly defaultValue: number;
  readonly max: number;
  readonly min: number;
  readonly onBlur: (value: number) => void;
  readonly onChange: (value: number) => void;
}

export interface CurrencyInputRef {
  readonly setValue: (value: number) => void;
}
