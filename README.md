# ☕ Coffee Shop Management System

A full-stack web application designed to manage coffee shop operations. It allows customers to browse products and place orders, while administrators can manage products and monitor customer orders through a dedicated dashboard.

## 🚀 Project Overview

Coffee Shop Management System is a web application developed using React.js and Spring Boot.

The project follows a frontend/backend architecture. The frontend communicates with the backend through REST APIs, while the backend handles business logic and database operations using MySQL.

The application provides two main interfaces:

- **Customer Interface:** Allows customers to browse the menu and place orders.
- **Administrator Interface:** Allows administrators to manage products and customer orders.

## ✨ Main Features

### 🛍️ Customer Features

- Browse available coffee shop products.
- View the product menu.
- Add products to an order.
- Place customer orders.
- Access a responsive and user-friendly interface.

### 🔐 Administrator Features

- Administrator login.
- Access to an administration dashboard.
- View and manage products.
- Add new products.
- Update existing products.
- Delete products.
- View customer orders.
- Update order statuses.

### ⚙️ Technical Features

- RESTful API architecture.
- Frontend/backend integration.
- CRUD operations.
- MySQL database integration.
- Environment-based configuration.
- Cross-Origin Resource Sharing (CORS) configuration.
- Responsive user interface.

## 🛠️ Technologies Used

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- React Hooks
- React Router

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Maven

### Database

- MySQL

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman

## 🏗️ Project Architecture

The project is organized into two independent applications:

```text
Coffee-Arabica/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── ...
│
├── README.md
└── SETUP.md
```

**Frontend:** React.js provides the user interface and sends HTTP requests to the backend using Axios.

**Backend:** Spring Boot exposes REST APIs, processes application requests and communicates with the MySQL database through Spring Data JPA.

**Database:** MySQL stores product and order information.

## ⚙️ Environment Configuration

The application uses environment variables to make local configuration easier.

- `backend/.env.example`: Backend and database configuration template.
- `frontend/.env.example`: Frontend API URL and administrator login configuration template.

Each developer must create their own `.env` files before running the application.

## ▶️ Installation and Execution

To install the required tools, configure the database and run the application locally, follow the instructions in:

**[SETUP.md – Installation and Setup Guide](SETUP.md)**

## 🧪 Testing

### Frontend Tests

The frontend is tested with **Jest** and **React Testing Library**. The tests render React components in a simulated browser (jsdom), act like a user (clicking buttons, typing in fields) and check what appears on the screen.

The backend does not need to be running: API calls are replaced by a mock, so tests are fast and do not depend on the database.

Run all frontend tests once:

```bash
cd frontend
npm test -- --watchAll=false
```

Run the tests in watch mode (re-runs automatically when a file changes):

```bash
cd frontend
npm test
```

Run a single test file:

```bash
cd frontend
npm test -- --watchAll=false src/pages/Menu.test.js
```

### Test Files

| File | Description |
|------|-------------|
| `frontend/src/setupTests.js` | Global test setup, loaded before every test file |
| `frontend/src/testUtils.js` | Helpers to mock the backend API (`mockFetch`) and read the data sent to it (`sentBodies`) |
| `frontend/src/pages/Menu.test.js` | Cart and checkout flow: product list, category filters, cart quantities and total, order submission |
| `frontend/src/pages/Orders.test.js` | Order management: order list, status and payment updates, order detail popup |
| `frontend/src/pages/Admin.test.js` | Product administration: product table, add, edit and delete products, save errors |
| `frontend/src/pages/AdminDashboard.test.js` | Dashboard: login redirect, revenue and order stats, last 7 days and top 5 products, 30-second refresh |
| `frontend/src/App.test.js` | Routing: admin pages redirect to the login page when not logged in, navbar links for visitors and admins |

> **Note:** `react-router-dom` v7 cannot be loaded by the Jest version bundled with Create React App, so `frontend/package.json` contains a `jest.moduleNameMapper` entry that points Jest to the right files. Do not remove it.

### Writing a New Test

Test files are placed next to the component they test and end with `.test.js`. A typical test follows three steps:

```js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockFetch } from '../testUtils';
import Menu from './Menu';

test('adds a product to the cart', async () => {
  // 1. Arrange: mock the API and render the component
  mockFetch({ '/products/available': [{ id: 1, name: 'Espresso', price: 15, category: 'COFFEE' }] });
  render(<Menu />);

  // 2. Act: interact like a user
  userEvent.click(await screen.findByRole('button', { name: /Ajouter au panier/ }));

  // 3. Assert: check what the user sees
  expect(screen.getByText(/Panier/)).toBeInTheDocument();
});
```

`mockFetch` takes a table of routes, relative to `http://localhost:8081/api`:

- `'/products/available': [...]` returns this JSON for a `GET` request.
- `'POST /orders': { id: 1 }` returns this JSON for a `POST` request.
- `{ ok: false }` simulates a server error.
