# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Frontend Jest tests for the cart and checkout flow (`frontend/src/pages/Menu.test.js`): product loading, category filters, cart quantities and total, and order submission.
- Test helper `frontend/src/testUtils.js` that mocks the backend API (`fetch`) in tests.
- Frontend Jest tests for the order status and admin screens: `Orders.test.js` (status and payment updates, order details), `Admin.test.js` (add, edit and delete products), `AdminDashboard.test.js` (stats, charts data, auto-refresh) and `App.test.js` (protected admin routes).

### Changed

- `frontend/src/setupTests.js` now adds a `TextEncoder`/`TextDecoder` polyfill required by React Router v7 under Jest.
- `frontend/package.json` maps `react-router-dom` and `react-router/dom` for Jest (`jest.moduleNameMapper`), because the bundled Jest 27 cannot resolve React Router v7's package entry points.

## [1.1.0] - 2026-11-02

### Added

- Ajout des tests d'intégration pour ProductController.
- Ajout des tests d'intégration pour OrderController.
- Ajout de la configuration H2 pour les tests.

### Changed

- Amélioration de la configuration des tests backend.

### Fixed

- Correction de problèmes liés à la configuration de l'environnement de test.

## 2026-11-01

### Added

- Environment configuration templates: `backend/.env.example` (server port, database credentials) and `frontend/.env.example` (API URL, admin login).
- `SETUP.md` installation and setup guide.

### Changed

- Database settings and admin login credentials are read from environment variables instead of being hardcoded.

## 2026-05-21

### Added

- Spring Boot backend with REST APIs for products (`/api/products`) and orders (`/api/orders`), including sales statistics endpoints.
- React frontend with customer pages (Home, Menu, About) and admin pages (Login, Products, Orders, Dashboard).
- README with project overview and technology stack.

## 2026-11-14

### Added

- User management functionality for administrators, including retrieving, creating, updating and deleting user accounts.
- Support for ADMIN and BARISTA user roles.
- Automatic administrator account initialization using environment variables.
- Spring Security configuration for authentication and role-based authorization.
- BCrypt password encoding for secure password storage.

### Changed

- Access permissions for user, product and order endpoints according to ADMIN and BARISTA roles.

## 2026-11-15

### Added

- Backend integration tests for user management using `UserControllerTest`.
- Spring Security Test support for testing protected endpoints with authenticated users and specific roles using `@WithMockUser`.

### Changed

- Backend integration tests updated to initialize MockMvc with Spring Security support.
- Docker Compose configuration updated to provide database credentials and administrator initialization settings to the backend container.
- MySQL and backend database configuration aligned to use the same database name.
