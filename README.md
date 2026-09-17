# Nova Finance Application

This project is separated into clean, independent `frontend` and `backend` directories.

## Project Structure

```
Fintech/
├── frontend/             # Expo React Native Frontend Application
│   ├── src/             # Frontend source components, features, navigation, store
│   ├── assets/          # App icons and visual assets
│   ├── App.jsx          # Entry application component
│   └── package.json     # Frontend dependencies and Expo scripts
│
└── backend/              # Express Node.js Backend API & Database
    ├── src/             # Backend routes, controllers, models, services
    ├── database.sqlite  # SQLite database storage
    └── package.json     # Backend dependencies and server scripts
```

## Running the Application

### 1. Backend Server
Navigate to the backend directory and start the development server:
```bash
cd backend
npm run dev
```
*The backend API runs at `http://localhost:5000/api/v1`.*

### 2. Frontend Application
In a separate terminal, navigate to the frontend directory and start the Expo dev server:
```bash
cd frontend
npm start
```

### Alternatively from Root Directory
```bash
# Run backend server
npm run start:backend

# Run frontend application
npm run start:frontend
```
