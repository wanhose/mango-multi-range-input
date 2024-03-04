'use client';

import React, {
  HTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './Draggable.module.css';

const ELEMENT_SIZE = 8;

export default function Draggable(props: DraggableProps) {
  const { left, max, min, onDrag, style, ...rest } = props;
  const draggableRef = useRef<HTMLDivElement>(null);
  // Relative position of the mouse to the draggable element
  const [cursorX, setCursorX] = useState<number | undefined>(undefined);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleStart = useCallback(
    (clientX: number) => {
      setIsDragging(true);

      const parentWidth = draggableRef.current?.parentElement?.clientWidth || 0;
      const nextValue = (parentWidth * left) / 100;

      setCursorX(clientX - nextValue);
    },
    [left],
  );

  const handleMove = useCallback(
    (clientX: number) => {
      // If we're not dragging, or we're not using relative positioning, do nothing
      if (!isDragging || typeof cursorX !== 'number') {
        return;
      }

      const position = Math.round(clientX - cursorX);
      const parentWidth = draggableRef.current?.parentElement?.clientWidth || 0;

      // Calculate the max and min in pixels
      const maxPx = Math.round((parentWidth * max) / 100);
      const minPx = Math.round((parentWidth * min) / 100);
      switch (true) {
        case position < minPx:
          onDrag(parentWidth, minPx);
          break;
        case position > maxPx:
          onDrag(parentWidth, maxPx);
          break;
        default:
          onDrag(parentWidth, position);
          break;
      }
    },
    [cursorX, isDragging, max, min, onDrag],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Only allow left click to drag
      if (event.button !== 0) {
        return;
      }

      handleStart(event.clientX);
    },
    [handleStart],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      handleMove(event.clientX);
    },
    [handleMove],
  );

  const handleMouseUpOrTouchEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging(false);
    },
    [],
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      handleStart(event.touches[0].clientX);
    },
    [handleStart],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      handleMove(event.touches[0].clientX);
    },
    [handleMove],
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUpOrTouchEnd);
    document.addEventListener('touchend', handleMouseUpOrTouchEnd);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUpOrTouchEnd);
      document.removeEventListener('touchend', handleMouseUpOrTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleMouseUpOrTouchEnd, handleTouchMove]);

  useEffect(() => {
    // Set the cursor to grabbing when dragging for all the page
    if (isDragging) {
      document.body.style.setProperty('cursor', 'grabbing');
    } else {
      document.body.style.removeProperty('cursor');
    }
  }, [isDragging]);

  return (
    <div
      className={styles.Container}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      ref={draggableRef}
      tabIndex={0}
      style={{
        cursor: isDragging ? 'grabbing' : undefined,
        height: ELEMENT_SIZE,
        left: `calc(${left}% - ${ELEMENT_SIZE / 2}px)`,
        width: ELEMENT_SIZE,
        ...style,
      }}
      {...rest}
    />
  );
}

export interface DraggableProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onKeyDown'> {
  readonly max: number;
  readonly min: number;
  readonly onKeyDown: (event: KeyboardEvent<HTMLSpanElement>) => void;
  readonly onDrag: (parentWidth: number, position: number) => void;
  readonly left: number;
}
