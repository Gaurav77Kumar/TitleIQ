import { useState, useEffect } from 'react';
import { ArrowUpRight, LogOut, Sparkles, Menu, X, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar({ onSignInClick }: { onSignInClick: () => void }) {
  const auth = useAuth();
  const user = auth?.user;
  const isAuthenticated = auth?.isAuthenticated;
  const isProUser = auth?.isPro || false;
  const logout = auth?.logout;
  
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/simulator', label: 'CTR Simulator', isPro: true },
    { to: '/history', label: 'History' },
    { to: '/compare', label: 'Compare' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className={`mx-auto max-w-[1200px] px-4 lg:px-8 transition-all duration-500`}>
          <div className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
            scrolled 
              ? 'bg-black/60 backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
              : 'bg-transparent'
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center font-heading italic text-black text-lg transition-transform group-hover:scale-105">
                IQ
              </div>
              <span className="text-white font-heading italic text-xl hidden sm:block">TitleIQ</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 ${
                    isActive(link.to) 
                      ? 'text-white bg-white/[0.08]' 
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                  {link.isPro && !isProUser && <Lock className="w-2.5 h-2.5 text-amber-500" />}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] font-black text-white uppercase">
                      {user.email[0]}
                    </div>
                    <span className="text-xs font-semibold text-white/70 max-w-[120px] truncate">{user.email.split('@')[0]}</span>
                    {user.tier === 'pro' && (
                      <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest">Pro</span>
                    )}
                  </div>
                  <button 
                    onClick={() => logout?.()}
                    className="p-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onSignInClick}
                  className="hidden md:flex items-center gap-2 bg-white text-black rounded-xl px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-all active:scale-[0.97] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Sign In <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[76px] z-40 p-4 md:hidden"
          >
            <div className="bg-black/80 backdrop-blur-2xl rounded-2xl border border-white/[0.06] p-6 shadow-[0_16px_64px_rgba(0,0,0,0.6)] space-y-2">
              {navLinks.map(link => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive(link.to) ? 'text-white bg-white/[0.08]' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/[0.06] pt-4 mt-4">
                {isAuthenticated ? (
                  <button onClick={() => logout?.()} className="w-full px-4 py-3 rounded-xl text-sm font-bold text-white/40 hover:text-white transition-all text-left flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <button onClick={onSignInClick} className="w-full bg-white text-black px-4 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97]">
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
