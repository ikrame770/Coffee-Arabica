export const API = 'http://localhost:8081/api';

// Replaces global.fetch with a mock driven by a route table.
// Keys are "METHOD /path" (or just "/path" for GET), relative to API.
// Values are the JSON body to return, { ok: false } for a failed response,
// or a function (request) => body for dynamic responses.
export function mockFetch(routes) {
  const fetchMock = jest.fn(async (url, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();
    const path = url.replace(API, '');
    const key = `${method} ${path}`;
    const route = key in routes ? routes[key] : routes[path];

    if (route === undefined) {
      throw new Error(`Unmocked request: ${key}`);
    }

    const body = typeof route === 'function'
      ? route({ url, method, body: options.body })
      : route;

    const ok = !(body && body.ok === false);
    return { ok, status: ok ? 200 : 500, json: async () => body };
  });

  // jsdom has no fetch of its own, so assign rather than spy
  global.fetch = fetchMock;
  return fetchMock;
}

// Returns the parsed JSON bodies sent to the given method + path.
export function sentBodies(fetchMock, method, path) {
  return fetchMock.mock.calls
    .filter(([url, options = {}]) =>
      url === API + path && (options.method || 'GET') === method)
    .map(([, options]) => JSON.parse(options.body));
}
