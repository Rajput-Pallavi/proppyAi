// ProppySignIn.jsx
import axios from 'axios';
import React, { useState } from 'react';
import img from '../assets/img.png';
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
  const BASE_URL = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:5000'
    : 'https://proppyai.onrender.com';

  // Password visibility and warnings
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState("");
  const [loginError, setLoginError] = useState("");

  // Handle Signup
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
      const res = await axios.post(`${BASE_URL}/signup`, {
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

  // Handle Login
  const handleLogin = async () => {
    setLoginError("");
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        email: loginData.email,
        password: loginData.password
      });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/main';
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-white">
      {/* Left Section */}
      <div className="flex-1 bg-gradient-to-br from-red-500 via-red-500 to-purple-600 flex flex-col justify-center px-16 py-12 text-white relative">
        <div className="absolute top-10 left-16 text-lg font-bold">
          <span className="text-yellow-300 text-5xl absolute -left-8 -top-4">\</span>
          Start Learning with Propy
        </div>

        <div className="relative z-10 mt-32">
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            <span className="text-yellow-300">Learn Out of the<br />box</span>
          </h1>
          <p className="text-base leading-relaxed mb-8 opacity-95">
            Start your Journey with Propy<br />
            easy and fast to learn.
          </p>
        </div>

        <div className="absolute bottom-0 -right-12">
          <img src={img} alt="mascot" className="w-72 h-auto" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-white flex items-center justify-center px-10">
        <div className="w-full max-w-md p-10 border-2 border-gray-900 rounded-lg">
          <h1 className="text-5xl font-black text-center mb-10 tracking-wider font-impact">Propy AI</h1>

          {isSignIn ? (
            // Sign In Form
            <div className={`w-full transition-all ${loginError ? 'animate-shake' : ''}`}>
              <h2 className="text-3xl text-center mb-2 font-semibold">Sign in to Propy</h2>
              <p className="text-center text-gray-600 mb-8 text-sm">Welcome back!</p>

              {/* Email */}
              <div className="mb-5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">✉️</span>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-4 pl-14 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 transition-colors"
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-4 pl-14 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 transition-colors"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {loginError && <div className="text-red-600 text-sm mb-4">{loginError}</div>}

              {/* Form Options */}
              <div className="flex justify-between items-center mb-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-gray-800 hover:underline">Forgot password?</a>
              </div>

              <button
                className="w-full py-4 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-full text-lg font-semibold cursor-pointer hover:-translate-y-1 transition-transform"
                onClick={handleLogin}
              >
                Login
              </button>

              <div className="text-center my-6 text-gray-600 relative">
                <span className="bg-white px-3 relative z-10">or</span>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
              </div>

              <div className="text-center text-sm text-gray-600">
                Don't have an account? <a onClick={() => setIsSignIn(false)} className="text-purple-600 font-semibold cursor-pointer hover:underline">Create New User</a>
              </div>
            </div>
          ) : (
            // Signup Form
            <div className="w-full">
              <h2 className="text-3xl text-center mb-2 font-semibold">Create New Account</h2>
              <p className="text-center text-gray-600 mb-8 text-sm">Join Propy today</p>

              {/* Name */}
              <div className="mb-5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">👤</span>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-4 pl-14 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 transition-colors"
                    value={signupData.name}
                    onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">✉️</span>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-4 pl-14 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 transition-colors"
                    value={signupData.email}
                    onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-4 pl-14 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 transition-colors"
                    value={signupData.password}
                    onChange={e => {
                      const val = e.target.value;
                      setSignupData({ ...signupData, password: val });
                      setPasswordWarning(val.length < 8 ? "Password must be at least 8 characters long" : "");
                    }}
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {passwordWarning && <span className="text-red-600 text-xs mt-1 block">{passwordWarning}</span>}
              </div>

              {/* Confirm Password */}
              <div className="mb-5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔒</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-4 pl-14 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 transition-colors"
                    value={signupData.confirmPassword}
                    onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Age */}
              <div className="mb-5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🎂</span>
                  <input
                    type="number"
                    placeholder="Age"
                    className="w-full px-4 py-4 pl-14 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 transition-colors"
                    value={signupData.age}
                    onChange={e => setSignupData({ ...signupData, age: e.target.value })}
                  />
                </div>
              </div>

              {/* Class */}
              <div className="mb-5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🏫</span>
                  <input
                    type="text"
                    placeholder="Class"
                    className="w-full px-4 py-4 pl-14 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 transition-colors"
                    value={signupData.class}
                    onChange={e => setSignupData({ ...signupData, class: e.target.value })}
                  />
                </div>
              </div>

              <button
                className="w-full py-4 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-full text-lg font-semibold cursor-pointer hover:-translate-y-1 transition-transform"
                onClick={handleSignup}
              >
                Create Account
              </button>

              <div className="text-center mt-6 text-sm text-gray-600">
                Already have an account? <a onClick={() => setIsSignIn(true)} className="text-purple-600 font-semibold cursor-pointer hover:underline">Sign In</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shake Animation */}
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}