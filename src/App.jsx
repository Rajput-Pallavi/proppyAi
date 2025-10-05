import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainApp from './Pages/MainApp/MainApp';
import SignIn from'../src/Pages/SingnIn/SignIn';
import Professor from './Pages/Professor/Professor';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<MainApp />} />
        {/* Professor 3D model page */}
        <Route path="/professor" element={<Professor />} />
        {/* Sign In page */}
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  )
}

export default App;
