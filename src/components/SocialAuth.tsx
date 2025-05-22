import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SocialAuth: React.FC = () => {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  
  const handleGoogleSignIn = async () => {
    try {
      // Add a small delay to ensure the popup isn't blocked
      await new Promise(resolve => setTimeout(resolve, 100));
      await googleSignIn();
      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        toast.error('Please enable popups for this website to use Google Sign-In');
      } else {
        console.error('Google sign in error:', error);
      }
    }
  };
  
  return (
    <div className="w-full">
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute left-0 right-0 border-t border-white/20"></div>
        <span className="relative bg-gradient-to-br from-violet-500 to-indigo-800 px-3 text-gray-300 text-sm">
          or continue with
        </span>
      </div>
      
      <button
        onClick={handleGoogleSignIn}
        className="w-full py-3 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center gap-3 text-white hover:bg-white/15 transition-colors backdrop-blur-sm"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </button>
    </div>
  );
};

export default SocialAuth;