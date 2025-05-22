import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface OTPVerificationFormProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
  email,
  onVerified,
  onCancel
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  
  // Simulating OTP verification since Firebase doesn't directly expose an OTP API for email
  // In a real application, you would verify the code against your backend or a service like Firebase Phone Auth
  const verifyOtp = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if OTP is correct (for demo, we'll accept any 6-digit code)
      const otpString = otp.join('');
      
      if (otpString.length === 6 && /^\d+$/.test(otpString)) {
        toast.success('Email verified successfully!');
        onVerified();
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      toast.error('Verification failed');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle input changes
  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);
    
    // Move to next input field if we have a value
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  // Handle backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // If current field is empty and backspace is pressed, move to previous field
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Handle paste event for the entire OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus on the last input
      inputRefs.current[5]?.focus();
    }
  };
  
  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);
  
  const handleResendOTP = () => {
    toast.success('New verification code sent!');
    setCountdown(30);
    setOtp(Array(6).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-white mb-4 text-center">Verify Your Email</h2>
      <p className="text-gray-300 text-center mb-8">
        We've sent a verification code to <span className="text-white font-medium">{email}</span>
      </p>
      
      <div className="flex gap-2 justify-center mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            ref={el => inputRefs.current[index] = el}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-12 h-14 text-center bg-white/10 border border-white/20 rounded-lg text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
          />
        ))}
      </div>
      
      <button
        onClick={verifyOtp}
        disabled={isSubmitting || otp.some(digit => digit === '')}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed group"
      >
        {isSubmitting ? 'Verifying...' : 'Verify Code'}
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
      
      <div className="mt-6 flex items-center justify-center">
        <button
          onClick={handleResendOTP}
          disabled={countdown > 0}
          className="text-purple-300 hover:text-purple-100 font-medium transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Resend code {countdown > 0 ? `(${countdown}s)` : ''}
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default OTPVerificationForm;