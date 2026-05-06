import React, { useState } from 'react';
import { api } from '../lib/api';
import type { CreateOrderResponse } from '@titleiq/shared';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Check, Sparkles, Loader2 } from 'lucide-react';

export const UpgradePage = () => {
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const isPro = user?.tier === 'pro';

  if (isPro) {
    return (
      <div className="pt-40 pb-24 px-6 text-center">
        <div className="liquid-glass rounded-3xl p-12 max-w-2xl mx-auto">
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <h1 className="text-4xl font-heading italic text-white mb-4">You're already Pro!</h1>
          <p className="text-white/50 mb-10">You have unlimited access to all features. Dominate that algorithm.</p>
          <a href="/" className="bg-white text-black px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">Back to Dashboard</a>
        </div>
      </div>
    );
  }

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to upgrade.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend
      const res = await api.post<CreateOrderResponse>('/billing/create-order', {});
      if (!res.success) {
        throw new Error('Failed to create order');
      }

      // 2. Load Razorpay script dynamically
      const loadScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // 3. Open Razorpay checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.amount,
        currency: res.currency,
        name: 'TitleIQ Pro',
        description: 'Upgrade to TitleIQ Pro',
        order_id: res.order_id,
        handler: async (response: any) => {
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await api.post<{ success: boolean }>('/billing/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              alert('Payment successful! You are now a Pro user.');
              window.location.href = '/';
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#4f46e5',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error(response.error);
        alert('Payment failed: ' + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error('Upgrade error:', err);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 lg:px-16 max-w-[1000px] mx-auto text-center">
      <div className="mb-20">
        <div className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-8 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Premium Strategy</span>
        </div>
        <h1 className="text-6xl md:text-9xl font-heading italic text-white tracking-tighter leading-[0.8] mb-10">
          Scale with <br /> <span className="text-white/20">Pro.</span>
        </h1>
        <p className="text-white/50 text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Unlock the full potential of TitleIQ and dominate the YouTube algorithm with advanced strategic tools.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        {/* Free Tier */}
        <div className="liquid-glass rounded-[3rem] p-12 border border-white/5 opacity-40 flex flex-col transition-all hover:opacity-60">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-6">Current Plan</h3>
          <p className="text-4xl font-heading italic text-white mb-10">Free Access</p>
          <ul className="text-left space-y-5 mb-12 flex-1">
            <FeatureItem text="3 Title Analyses / Day" checked={false} />
            <FeatureItem text="3 Thumbnail Scans / Day" checked={false} />
            <FeatureItem text="Basic Suggestions" checked={false} />
            <FeatureItem text="Public Feed Only" checked={false} />
          </ul>
        </div>

        {/* Pro Tier */}
        <div className="liquid-glass rounded-[3rem] p-12 border-2 border-indigo-500/40 bg-indigo-500/5 relative shadow-3xl flex flex-col group transition-all hover:border-indigo-500/60">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
            Most Popular
          </div>
          
          <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6">Unlimited Potential</h3>
          <div className="flex items-end justify-center gap-2 mb-10">
            <span className="text-7xl font-heading italic text-white">₹99</span>
            <span className="text-white/30 font-black uppercase text-[11px] pb-4 tracking-widest">/ Month</span>
          </div>
          
          <ul className="text-left space-y-5 mb-12 flex-1">
            <FeatureItem text="Unlimited Title Analyses" />
            <FeatureItem text="Unlimited Thumbnail Scans" />
            <FeatureItem text="A/B Strategy Compare" />
            <FeatureItem text="Full Analysis History (Last 20)" />
            <FeatureItem text="Advanced Visual Impact Scores" />
            <FeatureItem text="Priority AI Processing" />
          </ul>

          <button 
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-white text-black py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all active:scale-[0.97] shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get Pro Access Now <Sparkles className="w-4 h-4" /></>}
          </button>
        </div>
      </div>

      <div className="mt-24 pt-12 border-t border-white/5">
        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
          Secure Payments Powered by Razorpay
        </p>
        <div className="flex justify-center gap-8 mt-6 opacity-20 grayscale">
          <span className="text-white font-bold text-lg italic">UPI</span>
          <span className="text-white font-bold text-lg italic">MasterCard</span>
          <span className="text-white font-bold text-lg italic">Apple Pay</span>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text, checked = true }: { text: string, checked?: boolean }) => (
  <li className="flex items-center gap-4 group">
    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${checked ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-white/5 border-white/10'}`}>
      {checked ? <Check className="w-3.5 h-3.5 text-indigo-400" /> : <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />}
    </div>
    <span className={`text-sm font-bold tracking-tight ${checked ? 'text-white/80' : 'text-white/30'}`}>{text}</span>
  </li>
);
