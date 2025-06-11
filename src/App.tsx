import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Dashboard, Cannes, Live, Token } from './pages';
import { AppProvider } from './providers/AppProvider';
import ScrollToTop from './components/ui/ScrollToTop';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/garbage-cans" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/staking" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/quests" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/achievements" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/profile" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/cannes" element={<Cannes />} />
          <Route path="/cannes/leaderboard" element={<Cannes />} />
          <Route path="/cannes/founders" element={<Cannes />} />
          <Route path="/cannes/profile" element={<Cannes />} />
          <Route path="/live" element={<Live />} />
          <Route path="/token" element={<Token />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
