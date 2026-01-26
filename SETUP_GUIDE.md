# 🚀 Portfolio Manager - Full Stack Setup Guide

A modern, full-stack investment portfolio management application with React + TypeScript frontend and Node.js + MongoDB backend.

## ✨ Features Completed

### Backend (Node.js + Express + MongoDB)
- ✅ User authentication with JWT tokens
- ✅ Secure password hashing with bcrypt
- ✅ RESTful API with CRUD operations
- ✅ Investment tracking across 6 asset types (REIT, NPS, FD, SGB, DEMAT, Mutual Funds)
- ✅ Real-time portfolio statistics and analytics
- ✅ Protected routes with middleware
- ✅ MongoDB database integration

### Frontend (React + TypeScript + Vite)
- ✅ Modern glassmorphic UI design with animations
- ✅ Login & Registration pages with tabs
- ✅ Authentication context for state management
- ✅ API service layer with axios
- ✅ Add Investment component with backend integration
- ✅ Dashboard with 5 tabs (Overview, Analytics, Market, Watchlist, Transactions)
- ✅ Real-time data fetching from backend
- ✅ Responsive design with Tailwind CSS

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (running locally or MongoDB Atlas URI)
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create `.env` in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:8080
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
Update `MONGODB_URI` in `server/.env` with your Atlas connection string

## 🚀 Running the Application

### Option 1: Run Frontend & Backend Together
```bash
npm run dev:all
```

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

### Access Points
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login user
GET    /api/auth/profile     Get user profile (protected)
PUT    /api/auth/profile     Update profile (protected)
```

### Investments
```
GET    /api/investments          Get all investments (protected)
GET    /api/investments/stats    Get portfolio statistics (protected)
POST   /api/investments          Create investment (protected)
PUT    /api/investments/:id      Update investment (protected)
DELETE /api/investments/:id      Delete investment (protected)
```

## 🧪 Testing the Backend

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "pan": "ABCDE1234F",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response will include a JWT token. Use this token for protected routes.

### 3. Create an Investment
```bash
curl -X POST http://localhost:5000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "DEMAT",
    "name": "Reliance Industries",
    "amount": 10000,
    "currentValue": 12000,
    "units": 100
  }'
```

### 4. Get Portfolio Stats
```bash
curl http://localhost:5000/api/investments/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎨 Using the Application

### 1. Register/Login
- Visit http://localhost:8080
- Use the tabs to switch between Login and Sign Up
- Register with your details (PAN format: ABCDE1234F)
- Or login if you already have an account

### 2. Dashboard
- View portfolio overview with 6 investment types
- Click "Add Investment" button in the top right
- Fill in investment details and submit
- Data is saved to MongoDB and displayed in real-time

### 3. Investment Types
- **REIT**: Real Estate Investment Trusts
- **NPS**: National Pension Scheme
- **FD**: Fixed Deposits
- **SGB**: Sovereign Gold Bonds
- **DEMAT**: Stocks/Equities
- **MUTUAL_FUND**: Mutual Funds

## 📁 Project Structure

```
modern-invest-view/
├── server/                      # Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   └── investmentController.js
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Investment.js       # Investment schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── investmentRoutes.js
│   ├── .env                    # Backend config
│   ├── server.js               # Express app
│   └── package.json            # Server dependencies
│
├── src/                        # Frontend
│   ├── components/
│   │   ├── AddInvestment.tsx   # Add investment form
│   │   ├── Navbar.tsx          # Navigation
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx     # Auth state management
│   ├── hooks/
│   │   └── useInvestmentData.tsx # Data fetching hook
│   ├── pages/
│   │   ├── Index.tsx           # Login/Register page
│   │   └── Dashboard.tsx       # Main dashboard
│   ├── services/
│   │   └── api.ts              # API service layer
│   └── main.tsx                # App entry point
│
├── .env                        # Frontend config
├── package.json                # Root dependencies
└── README.md                   # This file
```

## 🔐 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for secure authentication
- Protected API routes
- Token stored in localStorage
- CORS enabled for frontend-backend communication
- PAN number validation (format: ABCDE1234F)
- Email validation

## 🎯 Key Technologies

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Axios
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- CORS

## 📊 Data Flow

1. User registers/logs in → JWT token generated
2. Token stored in localStorage
3. Token included in API requests (Authorization header)
4. Backend verifies token → Returns user-specific data
5. Frontend displays data with real-time updates

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `server/.env`
- For MongoDB Atlas, whitelist your IP

### CORS Errors
- Verify `CLIENT_URL` in `server/.env`
- Check backend is running on port 5000

### Authentication Errors
- Clear localStorage and re-login
- Check JWT_SECRET matches in backend

### Port Already in Use
```bash
# Change ports in respective .env files
# Frontend: Update vite.config.ts
# Backend: Update server/.env PORT variable
```

## 🚀 Production Deployment

1. Build frontend:
```bash
npm run build
```

2. Set environment variables on your hosting platform

3. Deploy backend to services like:
   - Heroku
   - Railway
   - Render
   - AWS

4. Deploy frontend to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront

5. Update CORS and API URLs accordingly

## 📝 Next Steps / Future Enhancements

- [ ] Add email verification
- [ ] Implement forgot password functionality
- [ ] Add investment performance charts
- [ ] Export portfolio reports as PDF
- [ ] Real-time market data integration
- [ ] Mobile responsive improvements
- [ ] Add data visualization with charts
- [ ] Implement portfolio rebalancing suggestions
- [ ] Add tax calculation features
- [ ] Multi-currency support

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for learning or personal use.
