import React, { useState } from 'react';
import { X, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { sendOtp, verifyOtp, isLoading } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await sendOtp(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send code');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await verifyOtp(email, otp);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden relative shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 pt-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {step === 'email' ? 'Keep Your Momentum' : 'Check your inbox'}
            </h2>
            <p className="text-slate-500 font-medium mt-2 leading-relaxed px-4">
              {step === 'email' 
                ? 'Sign in to reset your daily limits and save your full analysis history.' 
                : `We've sent a 6-digit code to ${email}`}
            </p>
          </div>

          <form onSubmit={step === 'email' ? handleSendOtp : handleVerifyOtp} className="space-y-4">
            {step === 'email' ? (
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            ) : (
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="000000"
                  required
                  maxLength={6}
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-black text-slate-900 tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-center placeholder:tracking-normal placeholder:font-medium"
                />
              </div>
            )}

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500 font-bold text-center uppercase tracking-wider"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {step === 'email' ? 'Get Magic Code' : 'Verify & Continue'}
            </button>

            {step === 'otp' && (
              <button 
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] hover:text-slate-600 transition-colors py-2"
              >
                Change Email Address
              </button>
            )}
          </form>
          
          <p className="mt-8 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
            No password required • Secure OTP login
          </p>
        </div>
      </motion.div>
    </div>
  );
};
