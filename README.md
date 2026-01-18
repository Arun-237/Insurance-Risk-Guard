# RiskGuard - Insurance Risk Assessment & Underwriting System

A comprehensive full-stack application for automating risk assessment and underwriting processes for insurance providers. Built with Java Spring Boot backend, React frontend, and SQL Server database.

## 📋 Project Overview

RiskGuard is designed to:

- Automate risk assessment and underwriting processes
- Calculate risk scores based on customer profiles and historical data
- Generate underwriting decisions automatically
- Manage insurance policies and premium payments
- Provide analytics and reporting dashboards
- Support role-based access for underwriters, agents, and administrators

### Key Features

- **Customer Profile Management**: Capture and validate customer data
- **Risk Scoring**: Automated risk calculation using predefined rules
- **Underwriting Workflow**: Approve/reject applications with audit trails
- **Policy Issuance**: Generate policy documents automatically
- **Premium Calculation**: Calculate and track premium payments
- **Risk Analytics**: Dashboard with risk distribution and trends
- **Compliance**: IRDAI guidelines compliance and secure data handling

## 🏗️ Architecture

```
RiskGuard/
├── backend/                      # Java Spring Boot REST API
│   ├── src/
│   │   ├── main/java/com/riskguard/
│   │   │   ├── customer/         # Customer module
│   │   │   ├── riskassessment/   # Risk assessment module
│   │   │   ├── underwriting/     # Underwriting decisions & policies
│   │   │   ├── premium/          # Premium payment module
│   │   │   └── analytics/        # Analytics & reporting
│   │   └── resources/
│   │       └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                     # React.js Dashboard
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service layer
│   │   └── styles/              # CSS styles
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── database/                     # SQL Server schemas
│   ├── schema.sql               # Database structure
│   └── sample-data.sql          # Sample data
├── docker-compose.yml           # Docker orchestration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 18+
- Docker & Docker Compose (recommended)
- SQL Server 2022 or SQL Server Express
- Maven 3.9+

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone/open project
cd RiskGuard

# Start all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8080/api
# SQL Server: localhost:1433
```

### Option 2: Manual Setup

#### 1. Database Setup

```bash
# Start SQL Server (Windows/Docker)
# Use SQL Server Management Studio or Azure Data Studio

# Run schema creation
sqlcmd -S localhost -U sa -P YourPassword@123 -i database/schema.sql

# Load sample data
sqlcmd -S localhost -U sa -P YourPassword@123 -i database/sample-data.sql
```

#### 2. Backend Setup

```bash
cd backend

# Update database connection in application.properties
# spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=riskguard
# spring.datasource.username=sa
# spring.datasource.password=YourPassword@123

# Build and run
mvn clean install
mvn spring-boot:run

# Backend runs on http://localhost:8080
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Frontend runs on http://localhost:3000
```

## 📚 API Endpoints

### Customer Management

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/{id}` - Get customer details
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Risk Assessment

- `GET /api/risk-assessments` - Get all assessments
- `POST /api/risk-assessments` - Create new assessment
- `GET /api/risk-assessments/{id}` - Get assessment details
- `GET /api/risk-assessments/customer/{customerId}` - Get customer assessments
- `GET /api/risk-assessments/result/{result}` - Filter by result

### Underwriting Decisions

- `GET /api/underwriting-decisions` - Get all decisions
- `POST /api/underwriting-decisions` - Create new decision
- `GET /api/underwriting-decisions/{id}` - Get decision details
- `GET /api/underwriting-decisions/customer/{customerId}` - Customer decisions
- `PUT /api/underwriting-decisions/{id}` - Update decision

### Policy Management

- `GET /api/policies` - Get all policies
- `POST /api/policies` - Create new policy
- `GET /api/policies/{id}` - Get policy details
- `GET /api/policies/customer/{customerId}` - Customer policies
- `PUT /api/policies/{id}` - Update policy

### Premium Payments

- `GET /api/premium-payments` - Get all payments
- `POST /api/premium-payments` - Record new payment
- `GET /api/premium-payments/{id}` - Get payment details
- `GET /api/premium-payments/policy/{policyId}` - Policy payments
- `PUT /api/premium-payments/{id}` - Update payment

### Analytics & Reporting

- `GET /api/risk-reports` - Get all reports
- `POST /api/risk-reports` - Generate new report
- `GET /api/risk-reports/{id}` - Get report details

## 🎯 Modules

### 1. Customer Profile & Data Collection

Manages customer information and document uploads

- Customer registration and profile management
- Document upload and verification
- Data validation and completeness checks

### 2. Risk Scoring & Rule Engine

Calculates risk scores and applies underwriting rules

- Automated risk scoring algorithm
- Rule-based decision engine
- High-risk profile flagging

### 3. Underwriting Decision & Policy Issuance

Approves/rejects applications and issues policies

- Underwriting workflow management
- Policy document generation
- Compliance audit logging

### 4. Premium Calculation & Payment Integration

Manages premium calculation and payment processing

- Dynamic premium calculation
- Payment gateway integration
- Payment tracking and reconciliation

### 5. Risk Analytics & Reporting

Provides insights and analytics

- Risk distribution analysis
- Underwriting trends
- Management dashboards and reports

## 🎨 User Interface

### Underwriter Dashboard

- Quick statistics (total applications, approvals, rejections)
- Risk distribution chart
- Applications requiring manual review
- Risk assessment details

### Admin Dashboard

- System-wide statistics
- Customer metrics
- System health monitoring
- Recent activity feed
- Approval rates and trends

## 🔐 Security Features

- ✅ SQL Injection prevention (parameterized queries)
- ✅ CORS configuration for frontend-backend communication
- ✅ Data encryption in transit (HTTPS)
- ✅ Input validation and sanitization
- ✅ Role-based access control
- ✅ Audit logging for compliance
- ✅ Secure password storage

## ⚙️ Configuration

### Backend Configuration (application.properties)

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=riskguard
spring.datasource.username=sa
spring.datasource.password=YourPassword@123

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# CORS
cors.allowed-origins=http://localhost:3000

# Logging
logging.level.com.riskguard=DEBUG
```

### Frontend Configuration

Environment variables in `.env`:

```
REACT_APP_API_URL=http://localhost:8080/api
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📦 Deployment

### Production Build

#### Backend

```bash
cd backend
mvn clean package -DskipTests
java -jar target/riskguard-1.0.0.jar
```

#### Frontend

```bash
cd frontend
npm run build
# Serve build directory with production web server
```

### Docker Deployment

```bash
docker-compose -f docker-compose.yml up -d
```

## 📊 Performance & Scalability

- **Performance**: Designed to handle 20,000 risk assessments per day
- **Scalability**: Horizontal scaling support via containerization
- **Database Indexing**: Optimized queries with strategic indexes
- **Connection Pooling**: HikariCP for optimal database connections
- **Caching**: Frontend caching for static assets

## 📋 Database Schema

Key tables:

- **customers** - Customer information
- **documents** - Uploaded documents for verification
- **risk_assessments** - Risk evaluation results
- **underwriting_decisions** - Approval/rejection decisions
- **policies** - Insurance policy details
- **premium_payments** - Payment transactions
- **risk_reports** - Generated analytics reports

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is proprietary and confidential.

## 📞 Support

For issues, questions, or suggestions:

1. Check existing documentation
2. Review API endpoint specifications
3. Check database schema and relationships
4. Contact the development team

## 🔄 Workflow

### Application Processing Flow

1. **Customer Registration** → Register and upload documents
2. **Data Validation** → Verify completeness and authenticity
3. **Risk Assessment** → Calculate risk score using rules
4. **Underwriting Review** → Manual review if required
5. **Decision** → Approve, decline, or request more info
6. **Policy Issuance** → Generate and issue policy
7. **Premium Collection** → Calculate and collect premium
8. **Ongoing Management** → Track payments and renewals

## 📈 Key Metrics

- Application processing time: < 5 minutes
- Risk assessment accuracy: > 95%
- System uptime: > 99.5%
- Database response time: < 100ms
- API response time: < 200ms

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready

## 🔗 Live Link

- Live project (GitHub): https://github.com/Arun-237/Insurance-Risk-Guard
