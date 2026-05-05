import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Navbar } from './components/landing/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { CtaFooter } from './components/landing/CtaFooter';
import { HistoryPage } from './pages/HistoryPage';
import { ComparePage } from './pages/ComparePage';
import { UpgradePage } from './pages/UpgradePage';
import { Simulator } from './pages/Simulator';
import { ScoreResults } from './components/ScoreResults';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen text-foreground font-body">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <div className="relative z-10">
        <Navbar onSignInClick={() => setIsAuthModalOpen(true)} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
        </Routes>
        
        <CtaFooter />
      </div>
    </div>
  );
}
