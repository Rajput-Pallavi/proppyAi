import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainApp from './Pages/MainApp/MainApp';
import SignIn from'../src/Pages/SingnIn/SignIn';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<MainApp />} />

        {/* Sign In page */}
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  )
}

export default App;
