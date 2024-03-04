import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Range, { RangeProps } from '../Range';

describe('Range', () => {
  const props: RangeProps = {
    values: [1, 5],
  };

  test('renders correctly', () => {
    const { container } = render(<Range {...props} />);

    expect(container.firstChild).toHaveClass('Container');
  });

  test('handles max input change', async () => {
    const onChange = jest.fn();

    render(<Range onChange={onChange} {...props} />);

    const input = screen.getByTestId('max-input');
    fireEvent.blur(input, { target: { textContent: '4' } });

    expect(onChange).toHaveBeenCalledWith([1, 4]);
  });

  test('handles min input change', async () => {
    const onChange = jest.fn();

    render(<Range onChange={onChange} {...props} />);

    const input = screen.getByTestId('min-input');
    fireEvent.blur(input, { target: { textContent: '2' } });

    expect(onChange).toHaveBeenCalledWith([2, 5]);
  });

  test('handles drag', () => {
    const onChange = jest.fn();

    render(<Range onChange={onChange} {...props} />);

    const maxDraggable = screen.getByTestId('max-draggable');
    const minDraggable = screen.getByTestId('min-draggable');

    fireEvent.mouseDown(minDraggable);
    fireEvent.mouseMove(minDraggable, { clientX: 100 });
    fireEvent.mouseUp(minDraggable);

    expect(onChange).toHaveBeenCalledTimes(2);

    fireEvent.mouseDown(maxDraggable);
    fireEvent.mouseMove(maxDraggable, { clientX: 100 });
    fireEvent.mouseUp(maxDraggable);

    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
