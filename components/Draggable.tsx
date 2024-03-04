'use client';

import React, {
  HTMLAttributes,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import styles from './Draggable.module.css';

const ELEMENT_SIZE = 8;

export default function Draggable(props: DraggableProps) {
  const { left, max, min, onDrag, ...rest } = props;
  const draggableRef = useRef<HTMLDivElement>(null);
  // Relative position of the mouse to the draggable element
  const [cursorX, setCursorX] = useState<number | undefined>(undefined);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Only allow left click to drag
      if (event.button !== 0) {
        return;
      }

      setIsDragging(true);

      const parentWidth = event.currentTarget.parentElement?.clientWidth || 0;
      const nextValue = (parentWidth * left) / 100;

      setCursorX(event.pageX - nextValue);
    },
    [left],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // If we're not dragging, or we're not using relative positioning, do nothing
      if (!isDragging || typeof cursorX !== 'number') {
        return;
      }

      const position = Math.round(event.pageX - cursorX);
      const parentWidth = draggableRef.current?.parentElement?.clientWidth || 0;

      // Calculate the max and min in pixels
      const maxPx = Math.round((parentWidth * max) / 100);
      const minPx = Math.round((parentWidth * min) / 100);
      switch (true) {
        case position < minPx:
          onDrag?.(parentWidth, minPx);
          break;
        case position > maxPx:
          onDrag?.(parentWidth, maxPx);
          break;
        default:
          onDrag?.(parentWidth, position);
          break;
      }
    },
    [cursorX, isDragging, max, min, onDrag],
  );

  const handleMouseUp = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp as any);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp as any);
    };
  }, [handleMouseMove, handleMouseUp]);

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
      ref={draggableRef}
      style={{
        cursor: isDragging ? 'grabbing' : undefined,
        height: ELEMENT_SIZE,
        left: `calc(${left}% - ${ELEMENT_SIZE / 2}px)`,
        width: ELEMENT_SIZE,
        ...rest.style,
      }}
      {...rest}
    />
  );
}

export interface DraggableProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag'> {
  readonly max: number;
  readonly min: number;
  readonly onDrag?: (parentWidth: number, position: number) => void;
  readonly left: number;
}
