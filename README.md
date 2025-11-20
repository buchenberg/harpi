# Harpi - HTTP Archive Pipeline

![a harpy](https://raw.githubusercontent.com/buchenberg/harpi/master/client/src/assets/img/brand/logo.png "Harpi")

Harpi is an HTTP Archive pipeline that helps document existing web APIs by converting HAR files to UML diagrams and Swagger documentation.

## 🚀 Modernized Architecture

This application has been modernized with the following improvements:

- **Separated client and server code** into distinct directories
- **Replaced Bower and Gulp** with modern npm and Vite
- **Updated all dependencies** to latest stable versions
- **Removed Heroku-specific configurations**
- **Modern build tools** and development workflow

## 📁 Project Structure

```
harpi/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── app/           # Core application files
│   │   ├── modules/       # Feature modules
│   │   └── assets/        # Static assets
│   ├── package.json       # Client dependencies
│   └── vite.config.js     # Vite configuration
├── server/                 # Backend application
│   ├── config/            # Server configuration
│   ├── modules/           # Server modules
│   ├── server.js          # Server entry point
│   └── package.json       # Server dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

## 🛠️ Technology Stack

### Backend (Server)
- **Node.js** 18+ with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **Passport.js** for authentication
- **Modern ES6+** JavaScript

### Frontend (Client)
- **AngularJS 1.8.3** (latest stable)
- **Bootstrap 5.3.2** for UI components
- **Vite** for modern build tooling
- **Socket.io Client** for real-time features

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+
- MongoDB
- **Java** (required for PlantUML UML diagram generation)
  - If Java is not installed, the installation will skip postinstall scripts
  - PlantUML features will not work without Java installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd harpi
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   
   **Note:** If Java is not installed, the installation will skip postinstall scripts to allow installation to complete. Java is required for PlantUML UML diagram generation features. You can install Java later and the PlantUML features will work once Java is available.

3. **Set up environment variables**
   ```bash
   cp server/config/env/local.example.js server/config/env/local.js
   # Edit server/config/env/local.js with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   ```

### Development

**Start both client and server in development mode:**
```bash
npm run dev
```

This will start:
- Server on `http://localhost:3001`
- Client on `http://localhost:3000` (with hot reload)

**Or start them separately:**
```bash
# Server only
npm run dev:server

# Client only  
npm run dev:client
```

### Production

1. **Build the client**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run server tests only
npm run test:server

# Run client tests only
npm run test:client

# Run tests with coverage
cd server && npm run test:coverage
cd client && npm run test:coverage
```

## 🔧 Available Scripts

### Root Level
- `npm run install:all` - Install dependencies for all packages
- `npm run dev` - Start both client and server in development
- `npm run build` - Build the client for production
- `npm start` - Start the server in production
- `npm test` - Run all tests
- `npm run lint` - Lint all code

### Server Scripts
- `npm run dev` - Start server with nodemon
- `npm start` - Start server in production
- `npm test` - Run server tests
- `npm run lint` - Lint server code

### Client Scripts
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run client tests
- `npm run lint` - Lint client code

## 📋 Features

### Current Features
- ✅ Create projects and upload HAR files
- ✅ Generate distinct URL reports on project HAR files
- ✅ Generate Swagger from HAR files
- ✅ Generate UML sequence diagrams from HAR files
- ✅ Show Swagger specs in included Swagger UI
- ✅ User authentication and management
- ✅ Real-time updates with Socket.io

### Planned Features
- 🔄 HAR to UML Class Diagram
- 🔄 HAR to Markdown documentation
- 🔄 Add metadata to HAR files using forms
- 🔄 Swagger spec versioning
- 🔄 Dredd testing for Swagger
- 🔄 Swagger UI extensions for legacy auth

## 🔌 API Endpoints

| Verb | Path | Description |
|------|------|-------------|
| GET | `/api/projects/{projectId}` | Get project by id |
| GET | `/api/projects/{projectId}?reportType=url` | List URLs covered in project |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects` | Update project |
| DELETE | `/api/projects/{projectId}` | Delete project by id |
| GET | `/api/hars/{harId}` | Get HAR by id |
| GET | `/api/hars` | List HARs |
| POST | `/api/hars` | Create HAR |
| POST | `/api/hars/{harId}/specs` | Create new spec from HAR by id |
| PUT | `/api/hars/{harId}` | Update HAR by id |
| DELETE | `/api/hars/{harId}` | Delete HAR by id |
| GET | `/api/specs/{specId}` | Get spec by id |
| GET | `/api/specs` | List specs |
| POST | `/api/specs` | Create spec |
| PUT | `/api/specs/{specId}` | Update spec by id |
| DELETE | `/api/specs/{specId}` | Delete spec by id |

## 🐳 Docker Support

The application includes Docker configurations for development and production:

```bash
# Development
docker-compose up -d

# Windows development
docker-compose -f docker-compose.yml -f docker-compose.windows.yml up -d

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👨‍💻 Author

**Gregory Buchenberger**

---

## 🔄 Migration Notes

This application has been modernized from the original MEAN.js structure:

- **Removed**: Bower, Gulp, Grunt
- **Added**: Vite, modern npm scripts, ES6+ features
- **Updated**: All dependencies to latest stable versions
- **Restructured**: Separated client and server code
- **Improved**: Development workflow and build process

The core functionality remains the same, but the development experience is now much more modern and maintainable.