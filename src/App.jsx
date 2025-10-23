import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainApp from './Pages/MainApp';
import SignIn from './Pages/SignIn';
import Shorts from './Pages/Shorts';
import MainPage from './Pages/MainApp';
import Header from './Compontents/Header';
import Admin from './Pages/Admin';
import Test from './Pages/test';
import Home from './Pages/home';
import './index.css';

const AppContent = () => {
  const location = useLocation();

  // Check if current path is '/signin'
  const hideHeader = location.pathname === '/signin' || location.pathname === '/home';

  return (
    <>
      {!hideHeader && <Header />}   {/* Header is hidden on SignIn page */}
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/test" element={<Test />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
