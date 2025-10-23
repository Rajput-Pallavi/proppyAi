import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainApp from './Pages/MainApp/MainApp';
import SignIn from './Pages/SignIn/SignIn';
import Shorts from './Pages/Shorts/Shorts';
import MainPage from './Pages/MainApp/MainApp';
import Header from './Compontents/Header';
import Admin from './Pages/Admin';

const AppContent = () => {
  const location = useLocation();

  // Check if current path is '/signin'
  const hideHeader = location.pathname === '/signin';

  return (
    <>
      {!hideHeader && <Header />}   {/* Header is hidden on SignIn page */}
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/admin" element={<Admin />} />
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
