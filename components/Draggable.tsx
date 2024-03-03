import React, {
  HTMLAttributes,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import styles from './Draggable.module.css';

export default function Draggable(props: HTMLAttributes<HTMLDivElement>) {
  const draggableRef = useRef<HTMLDivElement>(null);
  // Relative position of the mouse to the draggable element
  const [cursorX, setCursorX] = useState<number | undefined>(undefined);
  // Position of the draggable element
  const [elementX, setElementX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Only allow left click to drag
      if (event.button !== 0) {
        return;
      }

      setIsDragging(true);
      setCursorX(event.pageX - elementX);
    },
    [elementX],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // If we're not dragging, or we're not using relative positioning, do nothing
      if (!isDragging || !cursorX) {
        return;
      }

      const newElementX = event.pageX - cursorX;
      const parentWidth = draggableRef.current?.parentElement?.clientWidth || 0;
      const elementWidth = draggableRef.current?.offsetWidth || 0;

      switch (true) {
        case newElementX < 0:
          setElementX(0);
          break;
        case newElementX > parentWidth - elementWidth:
          setElementX(parentWidth - elementWidth);
          break;
        default:
          setElementX(newElementX);
          break;
      }
    },
    [cursorX, isDragging],
  );

  const handleMouseUp = useCallback((event: MouseEvent<HTMLDivElement>) => {
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
        left: `${elementX}px`,
        ...props.style,
      }}
      {...props}
    />
  );
}
