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
