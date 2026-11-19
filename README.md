# ☕ Coffee Shop Management System

A full-stack web application designed to manage coffee shop operations. It allows customers to browse products and place orders, while administrators can manage products and monitor customer orders through a dedicated dashboard.

## 🚀 Project Overview

Coffee Shop Management System is a web application developed using React.js and Spring Boot.

The project follows a frontend/backend architecture. The frontend communicates with the backend through REST APIs, while the backend handles business logic and database operations using MySQL.

The application provides two main interfaces:

- **Customer Interface:** Allows customers to browse the menu and place orders.
- **Administrator Interface:** Allows administrators to manage products, customer orders and application users.

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
- Manage application users.
- View registered users.
- Create new user accounts.
- Update existing user information.
- Activate or deactivate user accounts.

### 👥 User Management Features

- Dedicated user management for administrators.
- Retrieve all registered users.
- Create, update and activate or deactivate user accounts.
- Support for ADMIN and BARISTA roles.
- Role-based access control for user management operations.
- Secure password storage using BCrypt password encoding.
- Automatic initialization of the administrator account using environment variables.

### ⚙️ Technical Features

- RESTful API architecture.
- Frontend/backend integration.
- CRUD operations.
- MySQL database integration.
- Environment-based configuration.
- Cross-Origin Resource Sharing (CORS) configuration.
- Responsive user interface.
- Authentication and authorization using Spring Security.
- HTTP Basic Authentication for protected backend endpoints.
- Password encryption using BCrypt.
- Role-based access control for ADMIN and BARISTA users.
- Protected REST API endpoints.

## 🛠️ Technologies Used

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- Fetch API
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
- Docker & Docker Compose

## 🏗️ Project Architecture

The project is organized into two independent applications (plus a Docker Compose setup):

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
├── docker-compose.yml
├── .env.example
├── README.md
└── SETUP.md
```

**Frontend:** React.js provides the user interface and sends HTTP requests to the backend using Axios and the Fetch API.

**Backend:** Spring Boot exposes REST APIs, processes application requests and communicates with the MySQL database through Spring Data JPA.

**Database:** MySQL stores user, product and order information.

## 🔒 Security and Authorization

The backend uses Spring Security to protect REST API endpoints and control access according to user roles.

The application supports two roles:

- **ADMIN:** Has access to user management, product management, order management and statistics.
- **BARISTA:** Can manage products and access and update customer orders, but cannot manage users or delete orders.

The main access rules are:

| Resource                           | Access Permissions |
| ---------------------------------- | ------------------ |
| User Management (`/api/users/**`)  | ADMIN only         |
| View Products                      | Public             |
| Create, Update and Delete Products | ADMIN, BARISTA     |
| Create Orders                      | Public             |
| View Orders                        | ADMIN, BARISTA     |
| Update Order Status and Payment    | ADMIN, BARISTA     |
| Delete Orders                      | ADMIN only         |
| View Order Statistics              | ADMIN only         |

Passwords are encoded using BCrypt before being stored in the database.

The administrator account is initialized using environment variables, avoiding hardcoded administrator credentials in the backend source code.

### Frontend Authentication

The login page sends the credentials to `GET /api/auth/me` (HTTP Basic). On success, the user's role (`ADMIN` or `BARISTA`) is stored in `sessionStorage` and is cleared when the tab is closed or the user logs out.

- `frontend/src/auth.js`: login, logout, current session and authenticated API calls (`apiFetch`, `userApi`).
- `frontend/src/RoleRoute.js`: protects routes by role (visitors are redirected to `/login`, unauthorized roles to `/admin`).
- Navbar links and the order deletion button are displayed according to the role. This only affects the display: access control is enforced by Spring Security on the backend.


## ⚙️ Environment Configuration

The application uses environment variables to make local configuration easier.

- `.env.example` (project root): used by Docker Compose. Contains the database settings (`DB_*`), the initial administrator account (`ADMIN_*`) and the frontend API URL.
- `backend/.env.example`: Backend and database configuration template (when running without Docker).
- `frontend/.env.example`: Frontend API URL configuration template.

Each developer must create their own `.env` files before running the application.

Administrator credentials are no longer stored in the frontend: the login page authenticates against the backend (`GET /api/auth/me`), and the initial administrator account is created by the backend from `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `ADMIN_EMAIL`.

## ▶️ Installation and Execution

To install the required tools, configure the database and run the application locally, follow the instructions in:

**[SETUP.md – Installation and Setup Guide](SETUP.md)**

A Docker Compose setup is also available (see section 7b of SETUP.md).

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

| File                                        | Description                                                                                              |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `frontend/src/setupTests.js`                | Global test setup, loaded before every test file                                                         |
| `frontend/src/testUtils.js`                 | Helpers to mock the backend API (`mockFetch`) and read the data sent to it (`sentBodies`)                |
| `frontend/src/pages/Menu.test.js`           | Cart and checkout flow: product list, category filters, cart quantities and total, order submission      |
| `frontend/src/pages/Orders.test.js`         | Order management: order list, status and payment updates, order detail popup, order deletion (ADMIN only)                         |
| `frontend/src/pages/Admin.test.js`          | Product administration: product table, add, edit and delete products, save errors                        |
| `frontend/src/pages/AdminDashboard.test.js` | Dashboard: revenue and order stats, last 7 days and top 5 products, 30-second refresh    |
| `frontend/src/App.test.js`                  | Routing: protected pages redirect to the login page when not logged in, navbar links per role (visitor, barista, admin) |
| `frontend/src/pages/Users.test.js`          | User management: user list, create, edit (password optional), activate/deactivate, own account protection, load errors |
| `frontend/src/pages/Login.test.js`          | Login: successful login stores the role and redirects, wrong credentials show an error                    |
| `frontend/src/RoleRoute.test.js`            | Role-based route guard: visitor redirected to login, barista redirected from admin-only pages, admin allowed |

> **Note:** `react-router-dom` v7 cannot be loaded by the Jest version bundled with Create React App, so `frontend/package.json` contains a `jest.moduleNameMapper` entry that points Jest to the right files. Do not remove it.

> **Note:** These are component tests: they render the real components and routing, but the backend is replaced by `mockFetch`. Full frontend/backend integration (real login, roles, CORS) must be verified manually with the application running.

### Writing a New Test

Test files are placed next to the component they test and end with `.test.js`. A typical test follows three steps:

```js
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFetch } from "../testUtils";
import Menu from "./Menu";

test("adds a product to the cart", async () => {
  // 1. Arrange: mock the API and render the component
  mockFetch({
    "/products/available": [
      { id: 1, name: "Espresso", price: 15, category: "COFFEE" },
    ],
  });
  render(<Menu />);

  // 2. Act: interact like a user
  userEvent.click(
    await screen.findByRole("button", { name: /Ajouter au panier/ }),
  );

  // 3. Assert: check what the user sees
  expect(screen.getByText(/Panier/)).toBeInTheDocument();
});
```

`mockFetch` takes a table of routes, relative to `http://localhost:8081/api`:

- `'/products/available': [...]` returns this JSON for a `GET` request.
- `'POST /orders': { id: 1 }` returns this JSON for a `POST` request.
- `{ ok: false }` simulates a server error.

### Backend Tests

The backend is tested with **JUnit 5**, **Spring Boot Test**, **MockMvc**, and an **H2 in-memory database**.

The tests run against the actual Spring Boot application context. MockMvc sends HTTP requests to the REST controllers without starting a real HTTP server, while H2 provides an isolated test database instead of using the production MySQL database.

This allows us to test the backend endpoints, database operations, business logic, and HTTP responses without requiring the frontend or a running MySQL instance.

The backend integration tests also include Spring Security configuration. Protected endpoints are tested with authenticated users and their corresponding roles using Spring Security Test and `@WithMockUser`.

The tests verify that access to protected resources respects the application's authorization rules.

Run all backend tests once:

```bash
cd backend
./mvnw test
```

On Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd test
```

Run a single test class:

```bash
./mvnw -Dtest=ProductControllerTest test
```

Run a specific test method:

```bash
./mvnw -Dtest=OrderControllerTest#shouldCreateOrderAndCalculateTotal test
```

### Test Files

| File                                                                             | Description                                                                                                                                                               |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend/src/test/resources/application-test.properties`                         | Test configuration: uses an H2 in-memory database and creates/drops the database schema for each test context.                                                            |
| `backend/src/test/java/com/example/coffee/controller/ProductControllerTest.java` | Product management: retrieve all products, filter available products and categories, retrieve by ID, create, update and delete products.                                  |
| `backend/src/test/java/com/example/coffee/controller/OrderControllerTest.java`   | Order management: create orders, calculate totals, retrieve orders, filter by status, update status and payment, delete orders, and test overview and product statistics. |
| `backend/src/test/java/com/example/coffee/controller/UserControllerTest.java`    | User management: user-related API operations and access control for protected endpoints.                                                                                  |

### Writing a New Test

Backend test files are placed in `backend/src/test/java`, following the same package structure as the application. Test classes end with `Test.java`.

A typical integration test follows three steps:

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnAllProducts() throws Exception {

        // 1. Arrange: prepare the test data

        // 2. Act: send an HTTP request to the endpoint
        mockMvc.perform(get("/api/products"))

            // 3. Assert: verify the HTTP response
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }
}
```

`@SpringBootTest` loads the Spring application context, `@AutoConfigureMockMvc` configures MockMvc to test HTTP endpoints, and `@ActiveProfiles("test")` activates the test configuration.

`MockMvc` sends requests directly to the application without requiring a running frontend or external HTTP server.

### Test Database

The backend tests use **H2**, an in-memory relational database.

The test configuration is defined in:

`backend/src/test/resources/application-test.properties`

Each test prepares its required data and cleans up existing orders before products to respect foreign-key constraints.

**Note:** H2 is not identical to MySQL. Tests involving database-specific SQL functions, such as the daily and monthly sales queries using `DATE()`, are not currently included in the test suite. These features remain in the application source code but require a MySQL-compatible test environment to be tested reliably.
