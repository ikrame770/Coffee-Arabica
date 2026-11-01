import { render, screen } from '@testing-library/react';
import App from './App';
import { mockFetch } from './testUtils';

function renderAt(path) {
  window.history.pushState({}, '', path);
  render(<App />);
}

beforeEach(() => {
  localStorage.clear();
});

test.each(['/orders', '/admin', '/admindashboard'])(
  '%s redirects to the login page when not logged in',
  (path) => {
    renderAt(path);

    expect(screen.getByText('Espace Administrateur')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  }
);

test('an admin can open the product administration page', async () => {
  localStorage.setItem('adminAuth', 'true');
  mockFetch({ '/products': [] });
  renderAt('/admin');

  expect(await screen.findByText('⚙️ Administration des produits')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Déconnexion/ })).toBeInTheDocument();
});

test('a visitor sees the Admin login link instead of the admin menu', () => {
  renderAt('/about');

  expect(screen.getByRole('link', { name: /Admin/ })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Commandes/ })).not.toBeInTheDocument();
});
