import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Orders from './Orders';
import { mockFetch, sentBodies } from '../testUtils';

const orders = [
  {
    id: 1,
    customerName: 'Ikrame',
    phone: '0600000000',
    total: 50,
    status: 'PENDING',
    payment: 'UNPAID',
    items: [
      { id: 10, product: { name: 'Espresso' }, quantity: 2, price: 30 },
      { id: 11, product: { name: 'Latte' }, quantity: 1, price: 20 }
    ]
  },
  {
    id: 2,
    customerName: 'Yassine',
    phone: null,
    total: 25,
    status: 'READY',
    payment: 'PAID',
    items: [{ id: 12, product: { name: 'Crêpe Nutella' }, quantity: 1, price: 25 }]
  }
];

let alertSpy;

beforeEach(() => {
  alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
});

async function renderOrders(routes = {}) {
  const fetchMock = mockFetch({ '/orders': orders, ...routes });
  render(<Orders />);
  await screen.findByText('Ikrame');
  return fetchMock;
}

function orderRow(customerName) {
  return screen.getByText(customerName).closest('tr');
}

// Each row has two dropdowns: status first, then payment
function selects(customerName) {
  const [status, payment] = within(orderRow(customerName)).getAllByRole('combobox');
  return { status, payment };
}

function ordersLoads(fetchMock) {
  return fetchMock.mock.calls.filter(([url, options = {}]) =>
    url.endsWith('/api/orders') && (options.method || 'GET') === 'GET').length;
}

describe('Orders – list', () => {
  test('shows one row per order with its details', async () => {
    await renderOrders();

    const row = orderRow('Ikrame');
    expect(within(row).getByText('0600000000')).toBeInTheDocument();
    expect(within(row).getByText('50 MAD')).toBeInTheDocument();
    expect(screen.getByText('Yassine')).toBeInTheDocument();
  });

  test('shows a dash when the phone number is missing', async () => {
    await renderOrders();

    expect(within(orderRow('Yassine')).getByText('—')).toBeInTheDocument();
  });

  test('the dropdowns show the current status and payment', async () => {
    await renderOrders();

    expect(selects('Ikrame').status).toHaveValue('PENDING');
    expect(selects('Ikrame').payment).toHaveValue('UNPAID');
    expect(selects('Yassine').status).toHaveValue('READY');
    expect(selects('Yassine').payment).toHaveValue('PAID');
  });
});

describe('Orders – status and payment', () => {
  test('changing the status sends it to the server and reloads the list', async () => {
    const fetchMock = await renderOrders({ 'PUT /orders/1/status': {} });

    userEvent.selectOptions(selects('Ikrame').status, 'PREPARING');

    await waitFor(() => expect(ordersLoads(fetchMock)).toBe(2));
    expect(sentBodies(fetchMock, 'PUT', '/orders/1/status')).toEqual(['PREPARING']);
  });

  test('changing the payment sends it to the server and confirms', async () => {
    const fetchMock = await renderOrders({ 'PUT /orders/1/payment': {} });

    userEvent.selectOptions(selects('Ikrame').payment, 'PAID');

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('✅ Paiement mis à jour'));
    expect(sentBodies(fetchMock, 'PUT', '/orders/1/payment')).toEqual([{ payment: 'PAID' }]);
    expect(ordersLoads(fetchMock)).toBe(2);
  });
});

describe('Orders – detail popup', () => {
  test('shows the items and total of the selected order', async () => {
    await renderOrders();

    userEvent.click(within(orderRow('Ikrame')).getByRole('button', { name: /Détail/ }));
    const modal = document.querySelector('.modal');

    expect(within(modal).getByText('Commande #1')).toBeInTheDocument();
    expect(within(modal).getByText('Client : Ikrame')).toBeInTheDocument();
    expect(within(modal).getByText('Espresso')).toBeInTheDocument();
    expect(within(modal).getByText('Latte')).toBeInTheDocument();
    expect(within(modal).getByText('30 MAD')).toBeInTheDocument();
    expect(within(modal).getByText('Total : 50 MAD')).toBeInTheDocument();
  });

  test('the × button closes the popup', async () => {
    await renderOrders();

    userEvent.click(within(orderRow('Ikrame')).getByRole('button', { name: /Détail/ }));
    userEvent.click(within(document.querySelector('.modal')).getByRole('button', { name: '×' }));

    expect(document.querySelector('.modal')).not.toBeInTheDocument();
  });
});
