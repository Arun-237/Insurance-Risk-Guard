# RiskGuard Project Guidelines for Copilot

## Project Overview
RiskGuard is a full-stack Insurance Risk Assessment & Underwriting System with Java Spring Boot backend, React frontend, and SQL Server database.

## Technology Stack
- **Backend**: Java 17, Spring Boot 3.1.5, Maven
- **Frontend**: React 18, Bootstrap 5, Chart.js
- **Database**: SQL Server 2022
- **Containerization**: Docker & Docker Compose

## Project Structure
```
RiskGuard/
├── backend/              # Java Spring Boot REST API
├── frontend/             # React.js Dashboard  
├── database/             # SQL Server schemas
├── docker-compose.yml    # Service orchestration
└── README.md
```

## Key Modules
1. **Customer Module** (`com.riskguard.customer`) - Customer management
2. **Risk Assessment** (`com.riskguard.riskassessment`) - Risk scoring
3. **Underwriting** (`com.riskguard.underwriting`) - Decisions & policies
4. **Premium** (`com.riskguard.premium`) - Payment management
5. **Analytics** (`com.riskguard.analytics`) - Reporting & insights

## Code Conventions

### Java/Spring Boot
- Use Lombok for boilerplate reduction
- Implement @Repository for data access
- Use @Service for business logic
- Create DTOs for API responses
- Document complex business logic with comments

### React
- Functional components with hooks
- API calls in `services/api.js`
- Components in `src/components/`
- Pages in `src/pages/`
- Reusable styling in `styles/` folder

## Database
- All entities map to tables in SQL Server
- Use camelCase in Java, snake_case in SQL
- Foreign keys for relationships
- Indexes on frequently queried columns

## API Conventions
- REST endpoints under `/api/`
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Meaningful HTTP status codes

## Testing
- Unit tests in `src/test/`
- Use JUnit for backend
- Use Jest for frontend

## Development Workflow
1. Create feature branch
2. Make changes to backend/frontend
3. Test locally
4. Update documentation if needed
5. Commit with clear messages
6. Create pull request

## Important Notes
- CORS configured for localhost:3000
- Database password in properties file (change for production)
- Docker Compose includes all services
- Ensure port 8080 and 3000 are available

## Useful References
- Backend: `pom.xml` for dependencies, `application.properties` for config
- Frontend: `package.json` for dependencies, `src/services/api.js` for API calls
- Database: `database/schema.sql` for structure
