# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Terraform scripts (`infra/terraform/`) provisioning an Azure free-tier VM (Ubuntu 24.04 with Docker), network security group, virtual network, subnet and static public IP. Validated with `terraform validate` and `terraform plan`; not applied yet.
- `docs/AZURE_ACCOUNT_SETUP.md`: Azure account and tooling steps required before the first `terraform apply`.
- `docs/ARCHITECTURE.md`: Azure architecture diagram (Mermaid), services used, containers and NSG rules.
- Terraform ignore rules in `.gitignore` (state files, `*.tfvars`, `.terraform/`, plan files).
- Frontend Jest tests for the cart and checkout flow (`frontend/src/pages/Menu.test.js`): product loading, category filters, cart quantities and total, and order submission.
- Test helper `frontend/src/testUtils.js` that mocks the backend API (`fetch`) in tests.
- Frontend Jest tests for the order status and admin screens: `Orders.test.js` (status and payment updates, order details), `Admin.test.js` (add, edit and delete products), `AdminDashboard.test.js` (stats, charts data, auto-refresh) and `App.test.js` (protected admin routes).

### Changed

- `frontend/src/setupTests.js` now adds a `TextEncoder`/`TextDecoder` polyfill required by React Router v7 under Jest.
- `frontend/package.json` maps `react-router-dom` and `react-router/dom` for Jest (`jest.moduleNameMapper`), because the bundled Jest 27 cannot resolve React Router v7's package entry points.

## [1.1.0] - 2026-11-02

## [1.1.0] - 2026-11-02

### Added

- Add integration tests for `ProductController`.
- Add integration tests for `OrderController`.
- Add H2 database configuration for testing.

### Changed

- Improve backend test configuration.

### Fixed

- Fix issues related to the test environment configuration.

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


## 2026-11-24

### Added

- GitHub Actions CI/CD workflow to automate backend and frontend validation.
- Automated backend testing using Maven and Java 21.
- Backend code coverage reporting using JaCoCo.
- Automated frontend testing with coverage enabled using React Scripts.
- Frontend production build verification using Node.js 22.
- Test and coverage report uploads as GitHub Actions artifacts.
- Dependency vulnerability scanning using Trivy, focusing on HIGH and CRITICAL severity levels.
- Docker image build and publishing automation through GitHub Actions.
- Separate Docker images for the Spring Boot backend and React frontend.
- Automatic publishing of Docker images to Docker Hub after successful CI validation.
- Docker image versioning using `latest` and commit-specific SHA tags.
- Secure Docker Hub authentication using GitHub repository secrets.

### Changed

- Automated the project's validation process through independent backend, frontend, and security jobs.
- Integrated Docker image publishing into the CI/CD workflow, restricted to successful pushes to the `main` branch.