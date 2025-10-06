import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainApp from './Pages/MainApp/MainApp';
import SignIn from'../src/Pages/SingnIn/SignIn';
import Shorts from './Pages/Shorts/Shorts';


import MainPage from './Pages/MainApp/MainApp'; // <-- add this

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<MainApp />} />

        {/* Sign In page */}
        <Route path="/signin" element={<SignIn />} />

        {/* Main page after login */}
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default App;
