import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Dashboard, Cannes, Live, Token, DappHome, DappCollection, DappStaking } from './pages';
import { AppProvider } from './providers/AppProvider';
import ScrollToTop from './components/ui/ScrollToTop';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Main website routes */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cannes" element={<Cannes />} />
          <Route path="/cannes/leaderboard" element={<Cannes />} />
          <Route path="/cannes/founders" element={<Cannes />} />
          <Route path="/cannes/profile" element={<Cannes />} />
          <Route path="/live" element={<Live />} />
          <Route path="/token" element={<Token />} />
          
          {/* Dapp routes */}
          <Route path="/dapp" element={<DappHome />} />
          <Route path="/dapp/collection" element={<DappCollection />} />
          <Route path="/dapp/stake" element={<DappStaking />} />
          <Route path="/dapp/achievements" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/dapp/profile" element={<Dashboard />} /> {/* Placeholder */}
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
