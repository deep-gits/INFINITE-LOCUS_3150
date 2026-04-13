import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizerDashboard from './pages/OrganizerDashboard';
import UserDashboard from './pages/UserDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = React.useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'ORGANIZER' ? '/organizer/dashboard' : '/user/dashboard'} replace />;
    }

    return children;
};

function AppRoutes() {
    const { user } = React.useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow">
                <Routes>
                    <Route path="/" element={<Navigate to={user ? (user.role === 'ORGANIZER' ? '/organizer/dashboard' : '/user/dashboard') : '/login'} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    <Route path="/organizer/dashboard" element={
                        <ProtectedRoute allowedRoles={['ORGANIZER']}>
                            <OrganizerDashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/user/dashboard" element={
                        <ProtectedRoute allowedRoles={['USER']}>
                            <UserDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
