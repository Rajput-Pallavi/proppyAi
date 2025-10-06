// ProppySignIn.jsx
import axios from 'axios';
import React, { useState } from 'react';
import './SignIn.css';
import img from '../../assets/img.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ProppySignIn() {
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

  // Password visibility and warnings
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState("");

  // Login error state for shaking & inline message
  const [loginError, setLoginError] = useState("");

  // -----------------------------
  // Handle Signup
  // -----------------------------
  const handleSignup = async () => {
    if (signupData.password !== signupData.confirmPassword) {
      setPasswordWarning("Passwords do not match");
      return;
    }
    if (signupData.password.length < 8) {
      setPasswordWarning("Password must be at least 8 characters long");
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
      setIsSignIn(true);
    } catch (err) {
      setPasswordWarning(err.response?.data?.error || 'Signup failed');
    }
  };

  // -----------------------------
  // Handle Login
  // -----------------------------
  const handleLogin = async () => {
    setLoginError(""); // clear previous error
    try {
      const res = await axios.post('http://127.0.0.1:5000/login', {
        email: loginData.email,
        password: loginData.password
      });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/main'; // redirect immediately, no alert
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Invalid email or password');
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
            Start your Journey with Propy<br />
            easy and fast to learn.
          </p>
        </div>

        <div className="mascot">
          <img src={img} alt="mascot" />
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="form-container">
          <h1 className="brand-title">Propy AI</h1>

          {isSignIn ? (
            // -----------------------------
            // Sign In Form
            // -----------------------------
            <div className={`form-wrapper ${loginError ? 'shake' : ''}`}>
              <h2 className="form-title">Sign in to Propy</h2>
              <p className="form-subtitle">Welcome back!</p>

              {/* Email */}
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="Email"
                    className="input-field"
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password with Eye Icon */}
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input-field"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  />
                  <span
                    className="show-hide-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Inline error message */}
              {loginError && <div className="error-text">{loginError}</div>}

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>

              <button className="login-btn" onClick={handleLogin}>Login</button>

              <div className="divider"><span>or</span></div>

              <div className="account-link">
                Don't have an account? <a onClick={() => setIsSignIn(false)}>Create New User</a>
              </div>
            </div>
          ) : (
            // -----------------------------
            // Signup Form
            // -----------------------------
            <div className="form-wrapper">
              <h2 className="form-title">Create New Account</h2>
              <p className="form-subtitle">Join Propy today</p>

              {/* Name */}
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

              {/* Email */}
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

              {/* Password */}
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input-field"
                    value={signupData.password}
                    onChange={e => {
                      const val = e.target.value;
                      setSignupData({ ...signupData, password: val });
                      setPasswordWarning(val.length < 8 ? "Password must be at least 8 characters long" : "");
                    }}
                  />
                  <span
                    className="show-hide-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {passwordWarning && <span className="password-warning">{passwordWarning}</span>}
              </div>

              {/* Confirm Password */}
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="input-field"
                    value={signupData.confirmPassword}
                    onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  />
                  <span
                    className="show-hide-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Age */}
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

              {/* Class */}
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
