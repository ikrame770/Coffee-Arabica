import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu from './Menu';
import { mockFetch, sentBodies } from '../testUtils';

const products = [
  { id: 1, name: 'Espresso', price: 15, category: 'COFFEE', description: 'Court et intense' },
  { id: 2, name: 'Latte', price: 20, category: 'COFFEE' },
  { id: 3, name: 'Crêpe Nutella', price: 25, category: 'CREPE' }
];

let alertSpy;

beforeEach(() => {
  alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

async function renderMenu(routes = {}) {
  const fetchMock = mockFetch({ '/products/available': products, ...routes });
  render(<Menu />);
  await screen.findByText('Espresso');
  return fetchMock;
}

function addToCart(name) {
  const card = screen.getByText(name, { selector: '.product-name' }).closest('.product-card');
  userEvent.click(within(card).getByRole('button', { name: /Ajouter au panier/ }));
}

function openCart() {
  userEvent.click(screen.getByText(/🛒 Panier/));
  return document.querySelector('.modal');
}

function cartRow(modal, name) {
  return within(modal).getByText(name).closest('.cart-item');
}

function cartCount() {
  return document.querySelector('.cart-count');
}

describe('Menu – product list', () => {
  test('shows a loading state, then the available products', async () => {
    mockFetch({ '/products/available': products });
    render(<Menu />);

    expect(screen.getByText('Chargement du menu...')).toBeInTheDocument();
    expect(await screen.findByText('Espresso')).toBeInTheDocument();
    expect(screen.getByText('Latte')).toBeInTheDocument();
    expect(screen.getByText('Crêpe Nutella')).toBeInTheDocument();
    expect(screen.getByText('15 MAD')).toBeInTheDocument();
  });

  test('filters products by category', async () => {
    await renderMenu();

    userEvent.click(screen.getByRole('button', { name: /Crêpes/ }));
    expect(screen.getByText('Crêpe Nutella')).toBeInTheDocument();
    expect(screen.queryByText('Espresso')).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /Tout/ }));
    expect(screen.getByText('Espresso')).toBeInTheDocument();
  });

  test('shows an empty state for a category with no products', async () => {
    await renderMenu();

    userEvent.click(screen.getByRole('button', { name: /Gâteaux/ }));
    expect(screen.getByText('Aucun produit disponible')).toBeInTheDocument();
  });

  test('alerts when products cannot be loaded', async () => {
    mockFetch({ '/products/available': { ok: false } });
    render(<Menu />);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('Impossible de charger les produits'));
    expect(screen.getByText('Aucun produit disponible')).toBeInTheDocument();
  });
});

describe('Menu – cart', () => {
  test('the cart button only appears once something is added', async () => {
    await renderMenu();
    expect(cartCount()).not.toBeInTheDocument();

    addToCart('Espresso');
    expect(cartCount()).toHaveTextContent('1');
  });

  test('adding the same product twice increases its quantity', async () => {
    await renderMenu();
    addToCart('Espresso');
    addToCart('Espresso');

    // The badge counts distinct products, not total items
    expect(cartCount()).toHaveTextContent('1');

    const modal = openCart();
    expect(within(cartRow(modal, 'Espresso')).getByText('15 MAD × 2')).toBeInTheDocument();
  });

  test('+ and - change the quantity, and going below 1 removes the item', async () => {
    await renderMenu();
    addToCart('Espresso');
    addToCart('Latte');
    const modal = openCart();
    const row = cartRow(modal, 'Espresso');

    userEvent.click(within(row).getByRole('button', { name: '+' }));
    expect(within(row).getByText('15 MAD × 2')).toBeInTheDocument();

    userEvent.click(within(row).getByRole('button', { name: '-' }));
    userEvent.click(within(row).getByRole('button', { name: '-' }));
    expect(within(modal).queryByText('Espresso')).not.toBeInTheDocument();
    expect(cartCount()).toHaveTextContent('1');
  });

  test('the delete button removes the item from the cart', async () => {
    await renderMenu();
    addToCart('Espresso');
    addToCart('Latte');
    const modal = openCart();

    userEvent.click(within(cartRow(modal, 'Latte')).getByRole('button', { name: '🗑️' }));
    expect(within(modal).queryByText('Latte')).not.toBeInTheDocument();
    expect(within(modal).getByText('Espresso')).toBeInTheDocument();
  });

  test('computes the cart total', async () => {
    await renderMenu();
    addToCart('Espresso');
    addToCart('Espresso');
    addToCart('Latte');
    const modal = openCart();

    expect(within(modal).getByText('Total: 50.00 MAD')).toBeInTheDocument();
  });

  test('the × button closes the cart', async () => {
    await renderMenu();
    addToCart('Espresso');
    const modal = openCart();

    userEvent.click(within(modal).getByRole('button', { name: '×' }));
    expect(document.querySelector('.modal')).not.toBeInTheDocument();
  });
});

describe('Menu – checkout', () => {
  test('requires a customer name before ordering', async () => {
    const fetchMock = await renderMenu();
    addToCart('Espresso');
    const modal = openCart();

    userEvent.type(within(modal).getByPlaceholderText('Entrez votre nom'), '   ');
    userEvent.click(within(modal).getByRole('button', { name: /Confirmer la commande/ }));

    expect(alertSpy).toHaveBeenCalledWith('Veuillez entrer votre nom !');
    expect(sentBodies(fetchMock, 'POST', '/orders')).toHaveLength(0);
  });

  test('sends the order and clears the cart on success', async () => {
    const fetchMock = await renderMenu({ 'POST /orders': { id: 42 } });
    addToCart('Espresso');
    addToCart('Espresso');
    addToCart('Crêpe Nutella');
    const modal = openCart();

    userEvent.type(within(modal).getByPlaceholderText('Entrez votre nom'), '  Ikrame ');
    userEvent.type(within(modal).getByPlaceholderText('Votre numéro de téléphone'), '0600000000');
    userEvent.click(within(modal).getByRole('button', { name: /Confirmer la commande/ }));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('✅ Commande créée avec succès !'));
    expect(sentBodies(fetchMock, 'POST', '/orders')).toEqual([{
      customerName: 'Ikrame',
      phone: '0600000000',
      items: [
        { product: { id: 1 }, quantity: 2 },
        { product: { id: 3 }, quantity: 1 }
      ]
    }]);
    expect(document.querySelector('.modal')).not.toBeInTheDocument();
    expect(cartCount()).not.toBeInTheDocument();
  });

  test('keeps the cart when the order fails', async () => {
    await renderMenu({ 'POST /orders': { ok: false } });
    addToCart('Latte');
    const modal = openCart();

    userEvent.type(within(modal).getByPlaceholderText('Entrez votre nom'), 'Ikrame');
    userEvent.click(within(modal).getByRole('button', { name: /Confirmer la commande/ }));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('❌ Erreur lors de la création de la commande'));
    expect(within(modal).getByText('Latte')).toBeInTheDocument();
    expect(within(modal).getByPlaceholderText('Entrez votre nom')).toHaveValue('Ikrame');
  });
});
