# ⚙️ Coffee Shop Management System – Setup Guide

This guide explains how to install the required tools, configure the database, prepare environment variables and run the Coffee Shop Management System locally.

Follow the steps in order.

# 1. Prerequisites

Before running the project, make sure the following tools are installed.

## 1.1 Java Development Kit (JDK)

The backend is developed using Java and Spring Boot.

Install a compatible JDK. Java 21 is recommended for this project.

Verify the installation:

```bash
java -version
```

If Java is installed correctly, the command displays the installed Java version.

Download: [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)

## 1.2 Node.js and npm

Node.js and npm are required to install and run the React frontend.

Download the LTS version:

[https://nodejs.org/](https://nodejs.org/)

Verify the installation:

```bash
node -v
npm -v
```

Both commands should display their installed versions.

## 1.3 MySQL Server

MySQL is used as the application's relational database.

Download MySQL Community Server:

[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)

During installation, remember the username and password configured for your MySQL server.

You can use MySQL Workbench to manage your database:

[https://dev.mysql.com/downloads/workbench/](https://dev.mysql.com/downloads/workbench/)

## 1.4 Git

Git is required to clone the repository.

Download:

[https://git-scm.com/downloads](https://git-scm.com/downloads)

Verify the installation:

```bash
git --version
```

## 1.5 Code Editor

You can use Visual Studio Code or another IDE to open and modify the project.

Download:

[https://code.visualstudio.com/](https://code.visualstudio.com/)

# 2. Clone the Repository

Open a terminal and execute:

```bash
git clone https://github.com/ikrame770/Coffee-Arabica.git
```

Navigate to the project directory:

```bash
cd Coffee-Arabica
```

# 3. Database Configuration

Make sure your MySQL server is running.

Create the project database:

```sql
CREATE DATABASE coffee_db;
```

The database name must match the value configured in the backend environment file.

# 4. Backend Configuration

## 4.1 Navigate to the Backend

```bash
cd backend
```

## 4.2 Create the Environment File

Copy the example environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Linux / macOS:**

```bash
cp .env.example .env
```

## 4.3 Configure Backend Variables

Open `backend/.env` and provide your own MySQL credentials:

```env
SERVER_PORT=8081

DB_URL=jdbc:mysql://localhost:3306/coffee_db
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

Replace:

- `your_mysql_username` with your MySQL username.
- `your_mysql_password` with your MySQL password.

You can also change the server port if necessary, provided the frontend API URL is updated accordingly.

## 4.4 Run the Backend

The project includes a Maven Wrapper, so installing Maven separately is not normally necessary.

**Windows:**

```powershell
.\mvnw.cmd spring-boot:run
```

**Linux / macOS:**

```bash
./mvnw spring-boot:run
```

Wait until Spring Boot starts successfully.

The backend runs at:

`http://localhost:8081`

Keep this terminal open while using the application.

# 5. Frontend Configuration

Open a second terminal.

Navigate to the project directory and then to the frontend:

```bash
cd frontend
```

If you are already inside the `backend` directory, first return to the project root:

```bash
cd ..
cd frontend
```

## 5.1 Create the Environment File

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Linux / macOS:**

```bash
cp .env.example .env
```

## 5.2 Configure Frontend Variables

Open `frontend/.env` and configure:

```env
REACT_APP_API_URL=http://localhost:8081

REACT_APP_ADMIN_USERNAME=your_admin_username
REACT_APP_ADMIN_PASSWORD=your_admin_password
```

Choose your own administrator username and password.

The API URL must point to the address where your backend is running.

**Important:** React environment variables are included in the browser JavaScript bundle. The administrator credentials used by the current frontend login implementation are therefore not secret. This configuration is intended for local demonstration, not production security.

## 5.3 Install Frontend Dependencies

Run:

```bash
npm install
```

This command installs the dependencies defined in `package.json`.

## 5.4 Run the Frontend

Run:

```bash
npm start
```

The React application will start at:

`http://localhost:3000`

Keep this terminal open while using the application.

# 6. Access the Application

Once both applications are running:

| Component | URL                                            |
| --------- | ---------------------------------------------- |
| Frontend  | [http://localhost:3000](http://localhost:3000) |
| Backend   | [http://localhost:8081](http://localhost:8081) |

Open the frontend URL in your browser to use the application.

Use the administrator credentials configured in `frontend/.env` to access the administration interface.

# 7. Running the Project Again

After the initial installation, you do not need to repeat all the setup steps every time.

1. Start MySQL Server.
2. Open a terminal in `backend` and run:

```powershell
.\mvnw.cmd spring-boot:run
```

3. Open another terminal in `frontend` and run:

```bash
npm start
```

4. Open `http://localhost:3000` in your browser.

#

# 8. Troubleshooting

### Backend cannot connect to MySQL

- Make sure MySQL Server is running.
- Check the database name in `DB_URL`.
- Verify `DB_USERNAME` and `DB_PASSWORD`.
- Make sure the MySQL server is listening on the configured port.

### Frontend cannot communicate with the backend

- Make sure the backend is running.
- Check `REACT_APP_API_URL` in `frontend/.env`.
- Verify the backend CORS configuration.
- Restart the React development server after changing `.env`.

### npm is not recognized

- Make sure Node.js is installed.
- Close and reopen the terminal.
- Check that Node.js is available in the system PATH.

### Maven Wrapper does not run

On Linux or macOS, make the wrapper executable:

```bash
chmod +x mvnw
```

Then run:

```bash
./mvnw spring-boot:run
```

---

**Enjoy using Coffee Shop Management System! ☕**
