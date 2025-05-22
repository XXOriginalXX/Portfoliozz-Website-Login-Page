import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<User>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string): Promise<User> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Only send verification email after user is created
      if (result.user) {
        await sendEmailVerification(result.user);
        toast.success('Account created successfully! Please verify your email.');
      }
      return result.user;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      return result.user;
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  const googleSignIn = async (): Promise<User> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      toast.success('Logged in with Google successfully!');
      return result.user;
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        toast.error('Please enable popups for this website to use Google Sign-In');
      } else {
        toast.error(error.message || 'Failed to login with Google');
      }
      throw error;
    }
  };

  const sendVerificationEmail = async (): Promise<void> => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    
    try {
      await sendEmailVerification(currentUser);
      toast.success('Verification email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification email');
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    googleSignIn,
    sendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};