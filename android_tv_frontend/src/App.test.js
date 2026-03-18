import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the Android TV home screen by default', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /discover stories that feel made for the big screen/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /inicio/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /rogue one/i })).toBeInTheDocument();
});

test('navigates from home to the content information screen', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /películas/i }));

  expect(screen.getByRole('heading', { name: /the last voyage/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /watch now/i })).toBeInTheDocument();
  expect(screen.getByText(/remote: use arrow keys to move focus/i)).toBeInTheDocument();
});
