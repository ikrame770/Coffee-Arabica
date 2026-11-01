# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Frontend Jest tests for the cart and checkout flow (`frontend/src/pages/Menu.test.js`): product loading, category filters, cart quantities and total, and order submission.
- Test helper `frontend/src/testUtils.js` that mocks the backend API (`fetch`) in tests.

### Changed

- `frontend/src/setupTests.js` now adds a `TextEncoder`/`TextDecoder` polyfill required by React Router v7 under Jest.

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
