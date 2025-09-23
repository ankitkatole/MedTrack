# MedTrack - Digital Health Management System!!!

A comprehensive digital health management system that connects patients, doctors, and pharmacists through a modern web application.

## Features

### 🔐 Authentication & Authorization
- **Single Sign-up/Sign-in** for all user roles (Patient, Doctor, Pharmacist)
- **Role-based access control** with different dashboards for each role
- **JWT-based authentication** with secure token management
- **Dark mode support** with persistent theme preference

### 👤 Patient Features
- **Profile Management** - View personal information and MedTrack ID
- **Prescription History** - View all prescriptions issued by doctors
- **Prescription Details** - Detailed view of individual prescriptions with medicines, dosages, and instructions
- **Health Analytics** - Visual insights into prescription patterns, medicine categories, and doctor visits
- **Interactive Charts** - Line charts, pie charts, and bar charts for health data visualization

### 👨‍⚕️ Doctor Features
- **Patient Search** - Find patients by MedTrack ID to issue prescriptions
- **Prescription Creation** - Create detailed prescriptions with multiple medicines
- **Prescription Management** - View all prescriptions issued by the doctor
- **Patient Information** - Access patient details for prescription creation
- **Practice Analytics** - Visual insights into prescription patterns and patient visits

### 💊 Pharmacist Features
- **Patient Search** - Find patients by MedTrack ID to view their prescriptions
- **Prescription Dispensing** - Mark prescriptions as dispensed with optional remarks
- **Dispensed Medicines Tracking** - View all medicines dispensed by the pharmacist
- **Dispense Analytics** - Visual insights into dispensing patterns and patient interactions

## Technology Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with dark mode support
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Recharts** - Data visualization library
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
MedTrack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Layout/     # Layout components (Sidebar)
│   │   │   ├── Patient/    # Patient-specific components
│   │   │   ├── Doctor/     # Doctor-specific components
│   │   │   └── Pharmacist/ # Pharmacist-specific components
│   │   ├── contexts/       # React contexts (AuthContext)
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware (auth)
│   │   ├── model/          # Database models
│   │   ├── routes/         # API routes
│   │   └── db/             # Database connection
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MedTrack
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/medtrack
   JWT_SECRET=your-secret-key
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   BCRYPT_ROUNDS=10
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

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
- `GET /pharmacy/pharmacist/prescriptions/patient/:medTrackId` - Get patient's prescriptions
- `GET /pharmacy/pharmacist/prescriptions/:id` - Get specific prescription
- `POST /pharmacy/pharmacist/dispense/:id` - Dispense prescription
- `GET /pharmacy/pharmacist/prescriptions/dispensed` - Get dispensed prescriptions

## User Roles

### Patient
- Can view their profile and prescription history
- Can see detailed prescription information
- Has access to health analytics and visualizations

### Doctor
- Can search for patients by MedTrack ID
- Can create prescriptions for patients
- Can view all prescriptions they've issued
- Has access to practice analytics

### Pharmacist
- Can search for patients by MedTrack ID
- Can view patient prescriptions
- Can dispense prescriptions with remarks
- Can track all dispensed medicines
- Has access to dispensing analytics

## Key Features

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode** - Toggle between light and dark themes
- **Smooth Animations** - Fade-in and slide-up animations
- **Gradient Backgrounds** - Beautiful gradient color schemes
- **Interactive Components** - Hover effects and transitions

### 📊 Data Visualization
- **Line Charts** - Prescription trends over time
- **Pie Charts** - Medicine category distribution
- **Bar Charts** - Doctor visits and dispensing patterns
- **Statistics Cards** - Key metrics and KPIs

### 🔒 Security
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Role-based Access** - Different permissions for each user role
- **Input Validation** - Server-side validation for all inputs

### 🚀 Performance
- **Fast Loading** - Optimized React components
- **Efficient API Calls** - Minimal and targeted API requests
- **Responsive Images** - Optimized asset loading
- **Code Splitting** - Lazy loading for better performance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@medtrack.com or create an issue in the repository.

---

**MedTrack** - Digitizing healthcare, one prescription at a time. 🏥💊
