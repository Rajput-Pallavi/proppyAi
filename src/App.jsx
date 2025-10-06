import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainApp from './Pages/MainApp/MainApp';
import SignIn from'../src/Pages/SingnIn/SignIn';
import Shorts from './Pages/Shorts/Shorts';


const App = () => {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<MainApp />} />

        
        <Route path="/signin" element={<SignIn />} />

          <Route path="/Shorts" element={<Shorts/>}> </Route>
      </Routes>
    </Router>
  )
}

export default App;
