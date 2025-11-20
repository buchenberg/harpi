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

3. **Set up environment variables**
   ```bash
   cp server/config/env/local.example.js server/config/env/local.js
   # Edit server/config/env/local.js with your configuration
   ```

4. **Start MongoDB**

   You have two options:

   **Option A: Run MongoDB in Docker (Recommended)**
   ```bash
   # Start only the MongoDB service
   docker-compose up -d db
   
   # MongoDB will be available at mongodb://localhost:27017
   # The database will be persisted in ./data/db directory
   ```

   **Option B: Install MongoDB locally**
   ```bash
   # Install and start MongoDB on your system
   # Make sure MongoDB is running on localhost:27017
   ```

### Development

#### Running with Docker MongoDB

If you're using Docker for MongoDB (Option A above), the server will automatically connect to `mongodb://localhost:27017/harpi-dev` in development mode.

**Start both client and server in development mode:**

**Start both client and server in development mode:**
```bash
npm run dev
```

This will start:
- Server on `http://localhost:3000`
- Client on `http://localhost:3001` (with hot reload, proxies API requests to server)

**Or start them separately:**
```bash
# Server only (runs on http://localhost:3000)
npm run dev:server

# Client only (runs on http://localhost:3001, proxies API to server)
npm run dev:client
```

**Important:** Make sure to start the server **before** the client, as the client's Vite proxy needs the server to be running on port 3000.

#### Troubleshooting Connection Issues

If you see proxy errors like `ECONNREFUSED` when the client tries to connect to the server:

1. **Verify the server is running:**
   ```bash
   # Check if server is running on port 3000
   # You should see output like:
   # Environment:			development
   # Port:				3000
   # Database:				mongodb://localhost:27017/harpi-dev
   ```

2. **Check port conflicts:**
   ```bash
   # On Windows (PowerShell)
   netstat -ano | findstr :3000
   
   # On Linux/Mac
   lsof -i :3000
   ```

3. **Verify MongoDB is running:**
   ```bash
   # If using Docker
   docker-compose ps
   
   # The server won't start if MongoDB isn't available
   ```

4. **Start order matters:**
   - First: Start MongoDB (`docker-compose up -d db`)
   - Second: Start the server (`npm run dev:server`) - **Wait for it to fully start**
   - Third: Start the client (`npm run dev:client`)

5. **Check server logs for successful startup:**
   The server should show output like this when it starts successfully:
   ```
   Successfully connected to MongoDB!
   --
   Harpi - Development Environment
   Environment:			development
   Port:				3000
   Database:				mongodb://localhost:27017/harpi-dev
   --
   ```
   
   **If you don't see this output, the server didn't start and the client can't connect.**

6. **Common issues:**
   - **MongoDB not running**: Start it with `docker-compose up -d db`
   - **Server crashed on startup**: Check for MongoDB connection errors in server logs
   - **Port 3000 already in use**: Stop other services using port 3000 or change the server port
   - **MongoDB connection timeout**: Verify MongoDB is accessible at `mongodb://localhost:27017`

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
- ✅ View Swagger specs in interactive Swagger UI
- ✅ API documentation with Swagger UI
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
| GET | `/api/specs/{specId}/swagger` | Get Swagger JSON for a spec |
| GET | `/api/diagrams/{diagramId}` | Get diagram by id |
| GET | `/api/diagrams` | List diagrams |
| POST | `/api/diagrams` | Create diagram |
| POST | `/api/hars/{harId}/diagrams` | Generate diagram from HAR |
| GET | `/swagger` | View API documentation in Swagger UI |
| GET | `/swagger.json` | Get API documentation as JSON |
| GET | `/swagger/view/{specId}` | View generated spec in Swagger UI |

## 📚 API Documentation

Harpi includes interactive API documentation powered by Swagger UI:

### Viewing API Documentation

1. **Main API Documentation**
   - Access the interactive API documentation at: `http://localhost:3000/swagger`
   - Or via the client proxy: `http://localhost:3001/swagger`
   - This shows all available API endpoints with request/response schemas
   - You can test endpoints directly from the Swagger UI

2. **Viewing Generated Swagger Specs**
   - After generating a Swagger spec from a HAR file, click the "Swagger UI" button in the Specs list
   - Or navigate directly to: `http://localhost:3000/swagger/view/{specId}`
   - This opens the generated spec in an interactive Swagger UI where you can:
     - Browse all endpoints from the HAR file
     - View request/response schemas
     - Test endpoints directly
     - See the complete OpenAPI specification

3. **Swagger JSON Endpoints**
   - Get the API documentation JSON: `http://localhost:3000/swagger.json`
   - Get a specific spec's Swagger JSON: `http://localhost:3000/api/specs/{specId}/swagger`

The Swagger UI provides:
- Interactive API exploration
- Try-it-out functionality for testing endpoints
- Request/response schema documentation
- Organized endpoint grouping by tags

## 🐳 Docker Support

The application includes Docker configurations for development and production:

### Full Docker Setup

Run everything in Docker:

```bash
# Development
docker-compose up -d

# Windows development
docker-compose -f docker-compose.yml -f docker-compose.windows.yml up -d

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Hybrid Setup: MongoDB in Docker, App Locally (Recommended for Development)

This setup gives you the benefits of Docker for MongoDB while running the Node.js app locally for easier debugging and faster development:

1. **Start only MongoDB in Docker:**
   ```bash
   # Start MongoDB container
   docker-compose up -d db
   
   # Verify MongoDB is running
   docker-compose ps
   ```

2. **Configure local environment:**
   ```bash
   # Copy the example local config (if not already done)
   cp server/config/env/local.example.js server/config/env/local.js
   ```

3. **The server will automatically connect to MongoDB at `mongodb://localhost:27017/harpi-dev`** (this is the default in development mode)

4. **Run the application locally:**
   ```bash
   # Start both client and server
   npm run dev
   
   # Or start them separately
   npm run dev:server  # Server on http://localhost:3001
   npm run dev:client  # Client on http://localhost:3000
   ```

5. **Stop MongoDB when done:**
   ```bash
   docker-compose stop db
   # Or to remove the container (data persists in ./data/db)
   docker-compose down
   ```

**Benefits of this approach:**
- ✅ No need to install MongoDB locally
- ✅ MongoDB data persists in `./data/db` directory
- ✅ Easy to reset database (just delete `./data/db`)
- ✅ Full debugging capabilities for Node.js code
- ✅ Faster development cycle (no Docker rebuild needed)
- ✅ Hot reload works perfectly

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