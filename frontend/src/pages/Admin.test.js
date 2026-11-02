import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Admin from './Admin';
import { mockFetch, sentBodies } from '../testUtils';

const products = [
  { id: 1, name: 'Espresso', description: 'Court', price: 15, category: 'COFFEE', image: '', available: true },
  { id: 2, name: 'Tarte aux pommes', description: '', price: 22, category: 'CAKE', image: '', available: false }
];

let alertSpy;

beforeEach(() => {
  alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

async function renderAdmin(routes = {}) {
  const fetchMock = mockFetch({ '/products': products, ...routes });
  render(<Admin />);
  await screen.findByText('Espresso');
  return fetchMock;
}

function productRow(name) {
  return screen.getByText(name).closest('tr');
}

// The form labels are not linked to their inputs, so fields are found by role
function formFields() {
  const modal = document.querySelector('.modal');
  const [name, description, image] = within(modal).getAllByRole('textbox');
  return {
    modal,
    name,
    description,
    image,
    price: within(modal).getByRole('spinbutton'),
    category: within(modal).getByRole('combobox')
  };
}

function requests(fetchMock, method, path) {
  return fetchMock.mock.calls.filter(([url, options = {}]) =>
    url.endsWith('/api' + path) && (options.method || 'GET') === method);
}

describe('Admin – product list', () => {
  test('shows a loading state, then the product table', async () => {
    mockFetch({ '/products': products });
    render(<Admin />);

    expect(screen.getByText('Chargement des produits...')).toBeInTheDocument();
    const row = within(await screen.findByText('Espresso').then(el => el.closest('tr')));
    expect(row.getByText('15 MAD')).toBeInTheDocument();
    expect(row.getByText('COFFEE')).toBeInTheDocument();
    expect(row.getByText('✅')).toBeInTheDocument();
    expect(within(productRow('Tarte aux pommes')).getByText('❌')).toBeInTheDocument();
  });

  test('shows an empty state when there are no products', async () => {
    mockFetch({ '/products': [] });
    render(<Admin />);

    expect(await screen.findByText('Aucun produit')).toBeInTheDocument();
  });
});

describe('Admin – add and edit', () => {
  test('creates a new product and reloads the list', async () => {
    const fetchMock = await renderAdmin({ 'POST /products': { id: 3 } });

    userEvent.click(screen.getByRole('button', { name: /Nouveau Produit/ }));
    const fields = formFields();
    expect(within(fields.modal).getByText(/Ajouter un produit/)).toBeInTheDocument();

    userEvent.type(fields.name, 'Tiramisu');
    userEvent.type(fields.description, 'Maison');
    userEvent.type(fields.price, '30');
    userEvent.selectOptions(fields.category, 'CAKE');
    userEvent.click(within(fields.modal).getByRole('button', { name: '➕ Ajouter' }));

    await waitFor(() => expect(document.querySelector('.modal')).not.toBeInTheDocument());
    // The price is sent as a string, as typed in the form
    expect(sentBodies(fetchMock, 'POST', '/products')).toEqual([{
      name: 'Tiramisu',
      description: 'Maison',
      price: '30',
      category: 'CAKE',
      image: '',
      available: true
    }]);
    expect(requests(fetchMock, 'GET', '/products')).toHaveLength(2);
  });

  test('edits an existing product with the form pre-filled', async () => {
    const fetchMock = await renderAdmin({ 'PUT /products/1': {} });

    userEvent.click(within(productRow('Espresso')).getByRole('button', { name: /Modifier/ }));
    const fields = formFields();
    expect(fields.name).toHaveValue('Espresso');
    expect(fields.price).toHaveValue(15);
    expect(fields.category).toHaveValue('COFFEE');

    userEvent.clear(fields.price);
    userEvent.type(fields.price, '18');
    userEvent.click(within(fields.modal).getByRole('button', { name: '💾 Modifier' }));

    await waitFor(() => expect(sentBodies(fetchMock, 'PUT', '/products/1')).toHaveLength(1));
    expect(sentBodies(fetchMock, 'PUT', '/products/1')[0]).toMatchObject({
      id: 1,
      name: 'Espresso',
      price: '18'
    });
  });

  test('shows an alert and keeps the form open when saving fails', async () => {
    await renderAdmin({ 'POST /products': { ok: false } });

    userEvent.click(screen.getByRole('button', { name: /Nouveau Produit/ }));
    const fields = formFields();
    userEvent.type(fields.name, 'Tiramisu');
    userEvent.type(fields.price, '30');
    userEvent.click(within(fields.modal).getByRole('button', { name: '➕ Ajouter' }));

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Erreur lors de la sauvegarde'));
    expect(formFields().name).toHaveValue('Tiramisu');
  });

  test('cancel closes the form and clears it', async () => {
    await renderAdmin();

    userEvent.click(within(productRow('Espresso')).getByRole('button', { name: /Modifier/ }));
    userEvent.click(screen.getByRole('button', { name: /Annuler/ }));
    expect(document.querySelector('.modal')).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /Nouveau Produit/ }));
    expect(formFields().name).toHaveValue('');
  });
});

describe('Admin – delete', () => {
  test('deletes a product after confirmation and reloads the list', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const fetchMock = await renderAdmin({ 'DELETE /products/2': {} });

    userEvent.click(within(productRow('Tarte aux pommes')).getByRole('button', { name: /Supprimer/ }));

    expect(confirmSpy).toHaveBeenCalledWith('Supprimer ce produit ?');
    await waitFor(() => expect(requests(fetchMock, 'GET', '/products')).toHaveLength(2));
    expect(requests(fetchMock, 'DELETE', '/products/2')).toHaveLength(1);
  });

  test('does nothing when the deletion is cancelled', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    const fetchMock = await renderAdmin();

    userEvent.click(within(productRow('Espresso')).getByRole('button', { name: /Supprimer/ }));

    expect(requests(fetchMock, 'DELETE', '/products/1')).toHaveLength(0);
  });
});
