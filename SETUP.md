# RiskGuard - Development Setup Guide

## Quick Start Commands

### Using Docker Compose
```bash
# Navigate to project root
cd RiskGuard

# Start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f sqlserver
```

### Manual Development Setup

#### Windows PowerShell

```powershell
# 1. SQL Server Setup
# Download SQL Server Express from https://www.microsoft.com/en-us/sql-server/sql-server-downloads

# 2. Backend Setup
cd backend
mvn clean install
mvn spring-boot:run

# In another terminal:
# 3. Frontend Setup
cd frontend
npm install
npm start
```

#### Mac/Linux Bash

```bash
# 1. Install Java 17
brew install openjdk@17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# 2. Install Maven
brew install maven

# 3. Backend
cd backend
mvn clean install
mvn spring-boot:run

# In another terminal:
# 4. Frontend
cd frontend
npm install
npm start
```

## Environment Setup

### Java Environment
```
JAVA_VERSION: 17
MAVEN_VERSION: 3.9+
```

### Database
```
Type: Microsoft SQL Server 2022 or Express
Host: localhost
Port: 1433
Username: sa
Password: YourPassword@123
Database: riskguard
```

### Backend Port
```
Default: 8080
Context Path: /api
```

### Frontend Port
```
Default: 3000
```

## Database Initialization

### Option 1: SQL Server Management Studio
1. Open SQL Server Management Studio
2. Connect to: localhost,1433
3. Open `database/schema.sql`
4. Execute query
5. Open `database/sample-data.sql`
6. Execute query

### Option 2: sqlcmd CLI
```bash
sqlcmd -S localhost -U sa -P YourPassword@123 -i database/schema.sql
sqlcmd -S localhost -U sa -P YourPassword@123 -i database/sample-data.sql
```

### Option 3: Docker Container
```bash
docker-compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourPassword@123 -i database/schema.sql
```

## Verifying Installation

### Backend Health Check
```bash
curl http://localhost:8080/api/customers
# Should return JSON array of customers
```

### Frontend Check
Open http://localhost:3000 in browser
- Should see RiskGuard dashboard
- Navigation should work
- No console errors

### Database Check
```bash
sqlcmd -S localhost -U sa -P YourPassword@123
1> SELECT name FROM sys.tables WHERE database_id = DB_ID('riskguard');
```

## Troubleshooting

### Backend won't start
```bash
# Check port availability
# Windows
netstat -ano | findstr :8080
# Mac/Linux
lsof -i :8080

# Check database connection
# In backend/src/main/resources/application.properties
# Verify connection string and credentials
```

### Frontend won't start
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

### Database connection refused
```bash
# Verify SQL Server is running
# Windows: Services.msc → SQL Server service
# Docker: docker-compose logs sqlserver
# Mac: brew services list

# Check connection string format
# jdbc:sqlserver://localhost:1433;databaseName=riskguard;encrypt=true;trustServerCertificate=true
```

## Development Tools

### Recommended IDEs
- **Backend**: IntelliJ IDEA Community or VS Code with Java Extension Pack
- **Frontend**: VS Code with ES7+ React/Redux/React-Native snippets
- **Database**: Azure Data Studio or SQL Server Management Studio

### Useful Extensions (VS Code)
- Extension Pack for Java
- Spring Boot Dashboard
- REST Client
- Thunder Client (or Postman)

### API Testing
```bash
# Using curl
curl -X GET http://localhost:8080/api/customers

# Using Rest Client extension in VS Code
# Create requests.rest file
GET http://localhost:8080/api/customers
Content-Type: application/json
```

## Build & Deployment

### Backend Build
```bash
cd backend

# Development build
mvn clean package -DskipTests

# Production build with tests
mvn clean package

# Run JAR
java -jar target/riskguard-1.0.0.jar
```

### Frontend Build
```bash
cd frontend

# Development build
npm run build

# Analyze bundle size
npm run build -- --analyze
```

## Common Commands

### Maven Commands
```bash
mvn clean                 # Clean target directory
mvn install              # Build and install
mvn test                 # Run tests
mvn package              # Create JAR
mvn spring-boot:run      # Run app directly
```

### npm Commands
```bash
npm install              # Install dependencies
npm start               # Start dev server
npm test                # Run tests
npm run build           # Production build
```

### Docker Commands
```bash
docker-compose up                  # Start services
docker-compose up -d               # Start in background
docker-compose down                # Stop services
docker-compose logs -f             # View logs
docker-compose ps                  # List services
docker-compose exec backend bash   # Enter container
```

---

For more information, see [README.md](README.md)
