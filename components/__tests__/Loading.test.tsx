import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
  it('renders successfully', () => {
    render(<Loading />);

    const paragraph = screen.getByText('Loading...');

    expect(paragraph).toBeInTheDocument();
  });
});
