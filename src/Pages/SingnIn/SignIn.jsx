// PropsySignIn.jsx
import axios from 'axios';
import React, { useState } from 'react';
import './SignIn.css';
import img from '../../assets/img.png'
export default function PropsySignIn() {
  const [isSignIn, setIsSignIn] = useState(true);


    // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    class: ''
  });

  const handleSignup = async () => {
  if (signupData.password !== signupData.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  try {
    const res = await axios.post('http://127.0.0.1:5000/signup', {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      age: signupData.age,
      class: signupData.class
    });
    alert(res.data.message || 'Account created!');
    setIsSignIn(true); // switch to login after successful signup
  } catch (err) {
    alert(err.response?.data?.error || 'Signup failed');
  }
};

  return (
    <div className="propsy-container">
      {/* Left Section */}
      <div className="left-section">
        <div className="logo">
          <span className="backslash">\</span>
          Start Learning with Propy
        </div>
        
        <div className="content">
          <h1 className="main-heading">
            <span className="highlight">Learn Out of the<br />box</span>
          </h1>
          <p className="subtext">
            Start your Jernnoy with proppy<br />
            easy and fast to learn.
          </p>
        </div>
        
        <div className="mascot">
          <img src={img} alt="" />
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="form-container">
          <h1 className="brand-title">propy AI</h1>
          
          {isSignIn ? (
            // Sign In Form
            <div className="form-wrapper">
              <h2 className="form-title">sign in to propy</h2>
              <p className="form-subtitle">new topic to discuss</p>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="email"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="text"
                    placeholder="password"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">fagot password</a>
              </div>

              <button className="login-btn">Login</button>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="social-login">
                <div className="social-btn">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <path fill="#4285F4" d="M20 16.5v7.3h10.2c-.4 2.3-2.7 6.7-10.2 6.7-6.1 0-11.1-5-11.1-11.2S13.9 8.1 20 8.1c3.5 0 5.8 1.5 7.1 2.8l5.8-5.6C29.5 2.2 25.1 0 20 0 9 0 0 9 0 20s9 20 20 20c11.5 0 19.2-8.1 19.2-19.5 0-1.3-.1-2.3-.3-3.3L20 16.5z"/>
                    <path fill="#34A853" d="M0 20c0 3.3.8 6.4 2.3 9.1l7.5-6.2C8.7 20.6 8.9 18 10.8 15.8l-7.5-6.2C.8 13.6 0 16.7 0 20z"/>
                    <path fill="#FBBC04" d="M20 40c5.1 0 9.4-1.7 12.5-4.6l-6.1-5.2c-1.7 1.1-3.8 1.8-6.4 1.8-4.9 0-9.1-3.3-10.6-7.8l-6.1 5.2C6.5 35.8 12.7 40 20 40z"/>
                    <path fill="#EA4335" d="M39.2 17.2L20 16.5v7.3h10.2c-.5 1.3-1.2 2.4-2.2 3.3l6.1 5.2c3.7-3.4 6.1-8.5 6.1-14.1 0-1.3-.1-2.3-.3-3.3z"/>
                  </svg>
                </div>
                <div className="social-btn">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <path fill="#F25022" d="M0 0h19v19H0z"/>
                    <path fill="#00A4EF" d="M21 0h19v19H21z"/>
                    <path fill="#7FBA00" d="M0 21h19v19H0z"/>
                    <path fill="#FFB900" d="M21 21h19v19H21z"/>
                  </svg>
                </div>
                <div className="social-btn">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <path fill="#333" d="M20 0C9 0 0 9 0 20s9 20 20 20 20-9 20-20S31 0 20 0zm0 6c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm0 28c-5 0-9.4-2.6-12-6.5.1-4 8-6.2 12-6.2s11.9 2.2 12 6.2c-2.6 3.9-7 6.5-12 6.5z"/>
                  </svg>
                </div>
              </div>

              <div className="account-link">
                Don't have an account? <a onClick={() => setIsSignIn(false)}>Create New User</a>
              </div>
            </div>
          ) : (
            // Create Account Form
            <div className="form-wrapper">
              <h2 className="form-title">create new account</h2>
              <p className="form-subtitle">join propy today</p>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="Name"
                    className="input-field"
                    value={signupData.name}
                    onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="Email"
                    className="input-field"
                    value={signupData.email}
                    onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Password"
                    className="input-field"
                    value={signupData.password}
                    onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="input-field"
                    value={signupData.confirmPassword}
                    onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">🎂</span>
                  <input
                    type="number"
                    placeholder="Age"
                    className="input-field"
                    value={signupData.age}
                    onChange={e => setSignupData({ ...signupData, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">🏫</span>
                  <input
                    type="text"
                    placeholder="Class"
                    className="input-field"
                    value={signupData.class}
                    onChange={e => setSignupData({ ...signupData, class: e.target.value })}
                  />
                </div>
              </div>

              <button className="login-btn" onClick={handleSignup}>Create Account</button>

              <div className="account-link">
                Already have an account? <a onClick={() => setIsSignIn(true)}>Sign In</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
