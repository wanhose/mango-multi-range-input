import { render, fireEvent } from '@testing-library/react';
import CurrencyInput, { CurrencyInputProps } from '../CurrencyInput';

describe('CurrencyInput', () => {
  const props: CurrencyInputProps = {
    max: 100,
    min: 1,
    onBlur: jest.fn(),
    onChange: jest.fn(),
    defaultValue: 50,
  };

  it('renders successfully', () => {
    const { getByRole } = render(<CurrencyInput {...props} />);
    const input = getByRole('textbox');

    expect(input).toBeInTheDocument();
  });

  it('calls onChange with correct value when input changes', () => {
    const { getByRole } = render(<CurrencyInput {...props} />);
    const input = getByRole('textbox');

    fireEvent.input(input, { target: { textContent: '60' } });

    expect(props.onChange).toHaveBeenCalledWith(60);
  });

  it('resets to defaultValue when input is out of range', () => {
    const { getByRole } = render(<CurrencyInput {...props} />);
    const input = getByRole('textbox');

    fireEvent.input(input, { target: { textContent: '150' } });
    fireEvent.blur(input);

    expect(input.textContent).toBe('100');
  });
});
