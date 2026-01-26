# Portfolio Manager Backend

Node.js + Express + MongoDB backend for Portfolio Manager application.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Investment Management**: CRUD operations for multiple investment types
- **Portfolio Analytics**: Real-time statistics and calculations
- **Secure API**: Protected routes with middleware

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update MongoDB URI and JWT secret

3. Start MongoDB (if running locally):
```bash
mongod
```

## Running the Server

### Development Mode (with auto-restart):
```bash
npm run server
```

### Production Mode:
```bash
node server.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Investments
- `GET /api/investments` - Get all user investments (protected)
- `GET /api/investments/stats` - Get investment statistics (protected)
- `POST /api/investments` - Create new investment (protected)
- `PUT /api/investments/:id` - Update investment (protected)
- `DELETE /api/investments/:id` - Delete investment (protected)

### Health Check
- `GET /api/health` - Check API status

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio-manager
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:8080
```

## Investment Types

- `REIT` - Real Estate Investment Trusts
- `NPS` - National Pension Scheme
- `FD` - Fixed Deposits
- `SGB` - Sovereign Gold Bonds
- `DEMAT` - Stocks/Equities
- `MUTUAL_FUND` - Mutual Funds

## Data Models

### User Schema
- name (String, required)
- email (String, required, unique)
- pan (String, required, unique)
- password (String, required, hashed)
- createdAt (Date)

### Investment Schema
- userId (ObjectId, ref: User)
- type (String, enum)
- name (String)
- amount (Number)
- currentValue (Number)
- units (Number)
- purchaseDate (Date)
- maturityDate (Date)
- interestRate (Number)
- status (String)
- notes (String)

## Security

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens expire in 30 days
- Protected routes require valid JWT token
- CORS enabled for frontend communication

## Testing the API

Use tools like Postman or curl to test endpoints:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","pan":"ABCDE1234F","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get investments (requires token)
curl http://localhost:5000/api/investments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling

All errors return JSON with message:
```json
{
  "message": "Error description"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error
