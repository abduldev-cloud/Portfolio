# Portfolio Project

A modern, full-stack portfolio application built with Angular and Node.js. This project showcases a professional portfolio with smooth navigation, responsive design, and dynamic content sections.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

## ✨ Features

- **Smooth Section Navigation**: Seamless scrolling between portfolio sections (Intro, About, Projects, Contact)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Projects Showcase**: Dedicated section to display your work and projects
- **Contact Form**: Interactive contact section for visitor engagement
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Full-Stack Architecture**: Separate client and server for scalability

## 🛠 Tech Stack

### Frontend (Client)
- **Angular 11** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **SCSS** - Styling with Sass
- **RxJS** - Reactive programming

### Backend (Server)
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MySQL2** - Database driver
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22.x or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** (for database) - [Download here](https://www.mysql.com/downloads/)
- **Angular CLI** (optional, for development):
  ```bash
  npm install -g @angular/cli@11
  ```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd PortFolio_1
   ```

2. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install Server Dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=portfolio_db
   PORT=3000
   ```

5. **Set Up Database**
   
   Create your MySQL database and configure the connection in the `.env` file.

## 🎯 Running the Application

### Start the Backend Server

```bash
cd server
npm start
```

The server will run on `http://localhost:3000` (or your configured PORT).

### Start the Frontend Client

```bash
cd client
npm start
```

The Angular development server will run on `http://localhost:4200/`.

> **Note**: The client is configured with the `--openssl-legacy-provider` flag to ensure compatibility with Node.js 17+ and Angular 11's Webpack 4.

### Access the Application

Open your browser and navigate to:
```
http://localhost:4200/
```

## 📁 Project Structure

```
PortFolio_1/
├── client/                 # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # UI components
│   │   │   │   └── home/      # Home page component
│   │   │   ├── projects-section/  # Projects showcase
│   │   │   └── services/      # Angular services
│   │   └── assets/            # Static assets
│   └── package.json
│
└── server/                 # Node.js backend application
    ├── index.js            # Server entry point
    └── package.json
```

## 🔧 Troubleshooting

### OpenSSL Error (ERR_OSSL_EVP_UNSUPPORTED)

If you encounter the error `ERR_OSSL_EVP_UNSUPPORTED` when running `npm start`, this is due to Node.js 17+ using OpenSSL 3.0 which is incompatible with Webpack 4 (used by Angular 11).

**Solution**: The `package.json` has been configured with the legacy OpenSSL provider:

```json
"scripts": {
  "start": "set NODE_OPTIONS=--openssl-legacy-provider && ng serve",
  "build": "set NODE_OPTIONS=--openssl-legacy-provider && ng build"
}
```

This fix is already applied in the project.

### Port Already in Use

If port 4200 or 3000 is already in use:

**Windows (PowerShell)**:
```powershell
# Find process using port 4200
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess

# Kill the process
Stop-Process -Id <process-id> -Force
```

**Alternative**: Change the port in `angular.json` (client) or `.env` (server).

### Database Connection Issues

Ensure:
- MySQL server is running
- Credentials in `.env` are correct
- Database exists and is accessible

## 💻 Development

### Generate New Components

```bash
ng generate component component-name
```

### Build for Production

**Client**:
```bash
cd client
npm run build
```

Build artifacts will be stored in the `dist/` directory.

**Server**:
The server runs directly with Node.js. For production deployment, consider using PM2 or similar process managers.

### Code Scaffolding

Angular CLI supports generating various code elements:
```bash
ng generate directive|pipe|service|class|guard|interface|enum|module
```

### Running Tests

**Unit Tests**:
```bash
ng test
```

**End-to-End Tests**:
```bash
ng e2e
```

## 📝 Additional Notes

- This project was generated with Angular CLI version 11.2.12
- The client uses a custom route reuse strategy for optimized navigation
- Smooth scrolling and section management are handled in the `HomeComponent`

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is licensed under the ISC License.

---

For more help with Angular CLI, use `ng help` or check out the [Angular CLI Documentation](https://angular.io/cli).
