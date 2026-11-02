import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { mockFetch } from '../testUtils';

// Recharts measures its container, which is always 0×0 in jsdom, so the charts
// are replaced by plain elements that expose how many data points they received
jest.mock('recharts', () => {
  const Passthrough = ({ children }) => <div>{children}</div>;
  const Chart = (testId) => ({ data, children }) => (
    <div data-testid={testId} data-points={data ? data.length : 0}>{children}</div>
  );
  return {
    ResponsiveContainer: Passthrough,
    LineChart: Chart('line-chart'),
    BarChart: Chart('bar-chart'),
    PieChart: Passthrough,
    Pie: Chart('pie'),
    Line: () => null,
    Bar: () => null,
    Cell: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null
  };
});

const overview = {
  totalOrders: 12,
  totalRevenue: 1234.5,
  todayRevenue: 80,
  monthRevenue: 640.25,
  pending: 3,
  preparing: 2,
  ready: 1,
  delivered: 6
};

const daily = Array.from({ length: 10 }, (_, i) => ({ date: `2026-10-${10 + i}`, total: i * 10 }));

const productStats = [
  { product: 'Espresso', quantity: 40, revenue: 600 },
  { product: 'Latte', quantity: 30, revenue: 600 },
  { product: 'Crêpe Nutella', quantity: 20, revenue: 500 },
  { product: 'Tiramisu', quantity: 10, revenue: 300 },
  { product: 'Thé', quantity: 5, revenue: 50 },
  { product: 'Jus', quantity: 1, revenue: 12 }
];

function mockStats() {
  return mockFetch({
    '/orders/stats/overview': overview,
    '/orders/stats/daily': daily,
    '/orders/stats/products': productStats
  });
}

function renderDashboard() {
  render(
    <MemoryRouter initialEntries={['/admindashboard']}>
      <Routes>
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

function overviewLoads(fetchMock) {
  return fetchMock.mock.calls.filter(([url]) => url.endsWith('/stats/overview')).length;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.useRealTimers();
});

test('redirects to the login page when not logged in', async () => {
  const fetchMock = mockStats();
  renderDashboard();

  expect(await screen.findByText('Login page')).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
});

test('shows the revenue and order counts', async () => {
  localStorage.setItem('adminAuth', 'true');
  mockStats();
  renderDashboard();

  expect(await screen.findByText('1234.50 MAD')).toBeInTheDocument();
  expect(screen.getByText('80.00 MAD')).toBeInTheDocument();
  expect(screen.getByText('640.25 MAD')).toBeInTheDocument();
  expect(screen.getByText('12')).toBeInTheDocument();

  const statusCount = (label) =>
    screen.getByText(label, { selector: '.status-label' }).previousSibling;
  expect(statusCount('En attente')).toHaveTextContent('3');
  expect(statusCount('Livrées')).toHaveTextContent('6');
});

test('keeps the last 7 days and the top 5 products', async () => {
  localStorage.setItem('adminAuth', 'true');
  mockStats();
  renderDashboard();

  expect(await screen.findByTestId('line-chart')).toHaveAttribute('data-points', '7');
  expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-points', '5');

  expect(screen.getByText('Thé')).toBeInTheDocument();
  expect(screen.queryByText('Jus')).not.toBeInTheDocument();
  expect(screen.getByText('40 unités')).toBeInTheDocument();
});

test('refreshes the stats every 30 seconds', async () => {
  jest.useFakeTimers();
  localStorage.setItem('adminAuth', 'true');
  const fetchMock = mockStats();
  renderDashboard();

  await screen.findByText('1234.50 MAD');
  expect(overviewLoads(fetchMock)).toBe(1);

  // async act also waits for the reload triggered by the timer to finish
  await act(async () => {
    jest.advanceTimersByTime(30000);
  });

  await waitFor(() => expect(overviewLoads(fetchMock)).toBe(2));
});
