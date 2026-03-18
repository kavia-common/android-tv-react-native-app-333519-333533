import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Android TV content information screen', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /the last voyage/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /watch now/i })).toBeInTheDocument();
  expect(screen.getByText(/remote: use arrow keys to move focus/i)).toBeInTheDocument();
});
