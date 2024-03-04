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
    const { defaultValue, max, min, onChange, ...rest } = props;
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

        if (
          defaultValue &&
          (textContent === '' || min > value || max < value)
        ) {
          event.currentTarget.innerHTML = `${defaultValue}`;
          onChange?.(defaultValue);
        } else if (!isNaN(value)) {
          event.currentTarget.innerHTML = `${value}`;
          onChange?.(value);
        }
      },
      [defaultValue, max, min, onChange],
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
  readonly onChange: (value: number) => void;
}

export interface CurrencyInputRef {
  readonly setValue: (value: number) => void;
}
