import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 py-2 px-4 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
          <p className="text-gray-700">
            You have successfully logged in to the application.
          </p>
          
          <div className="mt-4 p-4 bg-indigo-50 rounded-md">
            <h3 className="font-medium text-indigo-800 mb-2">User Information</h3>
            <p><strong>Email:</strong> {currentUser?.email}</p>
            <p><strong>Email Verified:</strong> {currentUser?.emailVerified ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {currentUser?.uid}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;