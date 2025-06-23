# TrackIt - Personal Expense Tracker

A full-stack expense tracking application built with **Angular** frontend and **Spring Boot** backend, featuring a modern UI and robust API.

## 🎉 Status: Backend Successfully Connected!

Your TrackIt application is now fully operational with:
- ✅ **Spring Boot Backend** running on `http://localhost:8080`
- ✅ **Angular Frontend** running on `http://localhost:4200`
- ✅ **MySQL Database** connected and populated with sample data
- ✅ **CORS Configuration** properly set up for cross-origin requests
- ✅ **Sample Data** loaded for testing

## 🏗️ Architecture

```
TrackIt/
├── track-it/          # Spring Boot Backend
│   ├── src/main/java/com/shivansh/trackIt/
│   │   ├── controller/    # REST API Controllers
│   │   ├── service/       # Business Logic
│   │   ├── repository/    # Data Access Layer
│   │   ├── entity/        # JPA Entities
│   │   ├── dto/          # Data Transfer Objects
│   │   └── config/       # Configuration Classes
│   └── src/main/resources/
│       └── application.properties
└── trackit/           # Angular Frontend
    ├── src/app/
    │   ├── components/    # Angular Components
    │   ├── services/      # HTTP Services
    │   ├── models/        # TypeScript Interfaces
    │   └── utils/         # Utilities and Constants
    └── src/environments/
        └── environment.ts
```

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE trackit;
```

### 2. Backend Setup
```bash
cd track-it
./mvnw spring-boot:run
```
Backend will start on `http://localhost:8080`

### 3. Frontend Setup
```bash
cd trackit
npm install
npm start
```
Frontend will start on `http://localhost:4200`

## 🔧 Configuration

### Backend Configuration (`track-it/src/main/resources/application.properties`)
```properties
# Database
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/trackit
spring.datasource.username=root
spring.datasource.password=Shiv@1248

# Server
server.port=8080

# CORS
spring.web.cors.allowed-origins=http://localhost:4200
```

### Frontend Configuration (`trackit/src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'TrackIt'
};
```

## 📊 API Endpoints

### Test Endpoint (No Authentication Required)
- `GET /api/expenses/test` - Get all expenses for testing

### Protected Endpoints (Require Authentication)
- `GET /api/expenses` - Get user's expenses with filters
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/categories` - Get expense categories

## 🎨 Features

### Frontend Features
- **Modern Angular UI** with Material Design
- **Responsive Design** for mobile and desktop
- **Real-time Backend Connection** status indicator
- **Expense Management** with CRUD operations
- **Category-based Organization**
- **Status Tracking** (Paid, Pending, Upcoming)
- **Search and Filter** capabilities

### Backend Features
- **RESTful API** with proper HTTP methods
- **JPA/Hibernate** for database operations
- **Spring Security** for authentication (configured)
- **CORS Support** for cross-origin requests
- **Data Validation** and error handling
- **Sample Data Loading** for testing

## 📱 Sample Data

The application comes pre-loaded with sample expenses:
- Grocery Shopping ($85.50) - Paid
- Gas Station ($45.00) - Paid  
- Netflix Subscription ($15.99) - Pending
- Restaurant Dinner ($65.00) - Paid
- Gym Membership ($29.99) - Upcoming

## 🔍 Testing the Connection

### 1. Backend Test
```bash
curl -X GET http://localhost:8080/api/expenses/test
```

### 2. Frontend Test
Open `http://localhost:4200` in your browser and navigate to the dashboard to see the connection status.

### 3. Connection Status Indicator
The Angular dashboard displays:
- ✅ **Green Checkmark** - Backend connected successfully
- 🔄 **Loading Spinner** - Testing connection
- ❌ **Red Error** - Connection failed

## 🛠️ Development

### Backend Development
```bash
cd track-it
# Run with hot reload
./mvnw spring-boot:run

# Build JAR
./mvnw clean package
```

### Frontend Development
```bash
cd trackit
# Run development server
npm start

# Build for production
npm run build
```

## 📁 Project Structure

### Backend Structure
```
track-it/src/main/java/com/shivansh/trackIt/
├── TrackItApplication.java          # Main application class
├── controller/
│   └── ExpenseController.java       # REST API endpoints
├── service/
│   ├── ExpenseService.java          # Business logic
│   └── UserService.java             # User management
├── repository/
│   ├── ExpenseRepository.java       # Data access
│   └── UserRepository.java          # User data access
├── entity/
│   ├── Expense.java                 # Expense entity
│   └── User.java                    # User entity
├── dto/
│   ├── ExpenseDto.java              # Expense DTO
│   └── CreateExpenseRequest.java    # Create request DTO
└── config/
    ├── CorsConfig.java              # CORS configuration
    └── DataLoader.java              # Sample data loader
```

### Frontend Structure
```
trackit/src/app/
├── app.component.ts                 # Root component
├── components/
│   ├── dashboard/                   # Dashboard component
│   ├── navbar/                      # Navigation bar
│   ├── sidebar/                     # Sidebar menu
│   └── expense-list/                # Expense list
├── services/
│   └── expense.service.ts           # HTTP service
├── models/
│   └── expense.model.ts             # TypeScript interfaces
└── utils/
    └── constants.ts                 # Application constants
```

## 🔐 Security

The application includes Spring Security configuration:
- **JWT Authentication** (configured but not enabled for testing)
- **Password Encryption** using BCrypt
- **CORS Protection** for cross-origin requests
- **Input Validation** and sanitization

## 🚀 Deployment

### Backend Deployment
```bash
cd track-it
./mvnw clean package
java -jar target/track-it-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
cd trackit
npm run build
# Deploy dist/ folder to your web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console logs for both frontend and backend
2. Verify database connection
3. Ensure all services are running
4. Check CORS configuration

---

**🎉 Congratulations!** Your TrackIt expense tracker is now fully operational with a connected frontend and backend. You can start tracking your expenses immediately! 