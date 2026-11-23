import { render, screen } from '@testing-library/react';
import App from './App';
import { mockFetch } from './testUtils';

function renderAt(path) {
  window.history.pushState({}, '', path);
  render(<App />);
}

const loginAs = (role) =>
  sessionStorage.setItem(
    'auth',
    JSON.stringify({ token: 'x', username: 'sara', role })
  );

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

test.each(['/orders', '/admin', '/admindashboard', '/admin/users'])(
  '%s redirects to the login page when not logged in',
  (path) => {
    renderAt(path);

    expect(screen.getByText('Espace Administrateur')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  }
);

test('an admin can open the product administration page', async () => {
  loginAs('ADMIN');
  mockFetch({ '/products': [] });
  renderAt('/admin');

  expect(await screen.findByText('⚙️ Administration des produits')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Déconnexion/ })).toBeInTheDocument();
});

test('an admin sees the Dashboard and Users links', () => {
  loginAs('ADMIN');
  mockFetch({ '/products': [] });
  renderAt('/about');

  expect(screen.getByRole('link', { name: /Dashboard/ })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Utilisateurs/ })).toBeInTheDocument();
});

test('a barista sees orders and products but not Dashboard or Users', () => {
  loginAs('BARISTA');
  mockFetch({ '/products': [] });
  renderAt('/about');

  expect(screen.getByRole('link', { name: /Commandes/ })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Dashboard/ })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Utilisateurs/ })).not.toBeInTheDocument();
});

test('a visitor sees the Admin login link instead of the admin menu', () => {
  renderAt('/about');

  expect(screen.getByRole('link', { name: /Admin/ })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Commandes/ })).not.toBeInTheDocument();
});