import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
// import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/login">Login</Link> |{' '}
          <Link to="/signup">Signup</Link> |{' '}
          <Link to="/reset-password">Reset Password</Link>
        </nav>
        <header className="App-header">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<p>Welcome! Please select an option above.</p>} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
