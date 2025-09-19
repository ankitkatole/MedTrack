# MedTrack Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/medtrack
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
FRONTEND_URL=http://localhost:5173
BCRYPT_ROUNDS=10
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔧 Troubleshooting

### Server Not Starting
1. Check if MongoDB is running
2. Verify the `.env` file exists and has correct values
3. Check if port 5000 is available
4. Look at server console for error messages

### Database Connection Issues
1. Ensure MongoDB is installed and running
2. Check the MONGODB_URI in your `.env` file
3. Try connecting to MongoDB manually: `mongosh mongodb://localhost:27017/medtrack`

### Frontend Not Connecting to Backend
1. Verify the server is running on port 5000
2. Check browser console for CORS errors
3. Ensure the API_BASE_URL in AuthContext is correct

### Authentication Issues
1. Check if JWT_SECRET is set in `.env`
2. Verify token is being stored in localStorage
3. Check server logs for authentication errors

## 🧪 Testing the Setup

### Test Server Endpoints
```bash
cd server
node test-server.js
```

### Manual API Testing
You can test the API endpoints using curl or Postman:

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "aadhaar": "123456789012",
    "password": "password123",
    "role": "PATIENT"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "password123"
  }'
```

## 📱 User Roles and Features

### Patient
- View profile and prescription history
- See detailed prescription information
- Access health analytics and visualizations

### Doctor
- Search patients by MedTrack ID
- Create prescriptions for patients
- View all issued prescriptions
- Access practice analytics

### Pharmacist
- Search patients by MedTrack ID
- View patient prescriptions
- Dispense prescriptions with remarks
- Track dispensed medicines

## 🎨 UI Features

- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live data fetching and updates
- **Interactive Charts**: Beautiful data visualizations
- **Error Handling**: User-friendly error messages

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### User Routes
- `GET /user/profile` - Get user profile
- `GET /user/prescriptions` - Get user's prescriptions
- `GET /user/prescriptions/:id` - Get specific prescription

### Doctor Routes
- `GET /doctor/patient/:medTrackId` - Get patient by MedTrack ID
- `POST /doctor/prescriptions` - Create new prescription
- `GET /doctor/prescriptions/issued` - Get doctor's issued prescriptions

### Pharmacist Routes
- `GET /pharmacy/prescriptions/patient/:medTrackId` - Get patient's prescriptions
- `GET /pharmacy/prescriptions/:id` - Get specific prescription
- `POST /pharmacy/dispense/:id` - Dispense prescription
- `GET /pharmacy/prescriptions/dispensed` - Get dispensed prescriptions

## 🐛 Common Issues

### "Cannot find module" errors
- Run `npm install` in both server and client directories
- Check if all dependencies are properly installed

### CORS errors
- Ensure the server is running on the correct port
- Check the CORS configuration in server.js

### Database connection errors
- Verify MongoDB is running
- Check the connection string in your .env file
- Ensure the database name is correct

### Token verification errors
- Check if JWT_SECRET is set correctly
- Verify the token format in requests
- Check token expiration

## 📞 Support

If you encounter any issues:
1. Check the console logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check if MongoDB is running and accessible

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Server starts without errors
- ✅ Database connects successfully
- ✅ Frontend loads without console errors
- ✅ You can sign up and log in
- ✅ Role-based dashboards load correctly
- ✅ API calls work from the frontend
