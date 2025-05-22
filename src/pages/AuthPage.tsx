import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import OTPVerificationForm from '../components/OTPVerificationForm';
import SocialAuth from '../components/SocialAuth';
import AnimatedBackground from '../components/AnimatedBackground';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type AuthView = 'login' | 'register' | 'verify-otp';

const AuthPage: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);
  
  const switchToRegister = () => setView('register');
  const switchToLogin = () => setView('login');
  
  const handleRegistrationComplete = (userEmail: string) => {
    setEmail(userEmail);
    setView('verify-otp');
  };
  
  const handleVerificationComplete = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-8">
          {view === 'login' && (
            <>
              <LoginForm switchToRegister={switchToRegister} />
              <SocialAuth />
            </>
          )}
          
          {view === 'register' && (
            <RegisterForm switchToLogin={switchToLogin} />
          )}
          
          {view === 'verify-otp' && (
            <OTPVerificationForm
              email={email}
              onVerified={handleVerificationComplete}
              onCancel={switchToLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;