import { render, screen } from '@testing-library/react';
import Spinner from '../components/UI/Spinner';

test('renders spinner with default label', () => {
  render(<Spinner />);
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});

test('renders spinner with custom label', () => {
  render(<Spinner label='Fetching data' />);
  expect(screen.getByText(/Fetching data/i)).toBeInTheDocument();
});
