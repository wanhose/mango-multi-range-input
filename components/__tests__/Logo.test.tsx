import { render, screen } from '@testing-library/react';
import Logo from '../Logo';

describe('Logo', () => {
  it('renders successfully', () => {
    render(<Logo />);

    const img = screen.getByAltText('Mango Logo');

    expect(img).toBeInTheDocument();
    expect(img.getAttribute('height')).toBe('53');
    expect(img.getAttribute('width')).toBe('320');
  });
});
