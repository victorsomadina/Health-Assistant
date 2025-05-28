import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home/Home';
import UserSignup from './components/authentication/userAuth/UserSignup';
import UserLogin from './components/authentication/userAuth/UserLogin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/login" element={<UserLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;