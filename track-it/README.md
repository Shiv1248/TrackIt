# TrackIt - Spring Boot Backend

This is the Spring Boot backend for the TrackIt expense tracker application.

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+
- Angular frontend running on `http://localhost:4200`

## Setup

1. **Database Setup**
   - Create a MySQL database named `trackit`
   - Update database credentials in `src/main/resources/application.properties` if needed

2. **Install Dependencies**
   ```bash
   mvn clean install
   ```

3. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```
   
   Or use the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Access the Application**
   - Backend API: `http://localhost:8080`
   - API Base URL: `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Expenses
- `GET /api/expenses` - Get all expenses (with optional filters)
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `PATCH /api/expenses/{id}/status` - Update expense status
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/categories` - Get expense categories with counts

### Query Parameters for Expenses
- `status` - Filter by status (paid, pending, upcoming)
- `category` - Filter by category
- `dateFrom` - Filter by start date (YYYY-MM-DD)
- `dateTo` - Filter by end date (YYYY-MM-DD)
- `minAmount` - Filter by minimum amount
- `maxAmount` - Filter by maximum amount
- `search` - Search in title, description, or category

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username/email
- `password` - Encrypted password
- `created_at` - Creation timestamp

### Expenses Table
- `id` - Primary key
- `title` - Expense title
- `category` - Expense category
- `description` - Expense description
- `amount` - Expense amount
- `date` - Expense date
- `status` - Expense status (PAID, PENDING, UPCOMING)
- `user_id` - Foreign key to users table
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Configuration

### Application Properties
- Database connection settings
- JWT configuration
- CORS settings
- Logging configuration

### CORS Configuration
The backend is configured to allow requests from `http://localhost:4200` (Angular frontend).

## Security

- JWT-based authentication
- Password encryption using BCrypt
- CORS configuration for frontend access
- Role-based access control (future enhancement)

## Testing the Backend

1. **Start the backend server**
2. **Test with curl or Postman:**
   ```bash
   # Test health check
   curl http://localhost:8080/api/expenses
   
   # Test with authentication (after implementing auth)
   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8080/api/expenses
   ```

3. **Connect with Angular frontend:**
   - Start your Angular application
   - Navigate to the dashboard
   - The frontend will automatically test the backend connection

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `application.properties`
   - Verify database `trackit` exists

2. **CORS Errors**
   - Ensure Angular frontend is running on `http://localhost:4200`
   - Check CORS configuration in `CorsConfig.java`

3. **Port Already in Use**
   - Change port in `application.properties` or
   - Stop other applications using port 8080

4. **JWT Token Issues**
   - Check JWT secret in `application.properties`
   - Ensure proper token format in requests

## Development

### Project Structure
```
src/main/java/com/shivansh/trackIt/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── entity/         # JPA entities
├── repository/     # Data access layer
├── security/       # Security configuration
└── service/        # Business logic
```

### Adding New Features
1. Create entity in `entity/` package
2. Create repository in `repository/` package
3. Create service in `service/` package
4. Create controller in `controller/` package
5. Add DTOs if needed in `dto/` package

## Next Steps

1. Implement user authentication endpoints
2. Add more expense management features
3. Implement reporting and analytics
4. Add data export functionality
5. Implement real-time notifications 