import React from 'react'
import './Header.css'
const Header = () => {
     const [showProfile, setShowProfile] = useState(false);

const user = {
    name: "Pallavi Rajput",
    class: "10th Grade",
    school: "ABC School",
    learningRecord: "Completed 15 lessons",
    testScore: "85%"
  };

  return (
    <header className="top-nav">
      <h1 className="logo">EduApp</h1>
      <div className="nav-buttons">
        <button className="nav-btn" onClick={() => setShowProfile(!showProfile)}>
          <FaUserCircle size={24} /> Profile
        </button>
        <button className="nav-btn">
          <FaFilm size={24} /> Reels
        </button>
      </div>

      {showProfile && (
        <div className="profile-dropdown">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Class:</strong> {user.class}</p>
          <p><strong>School:</strong> {user.school}</p>
          <hr />
          <p><strong>Learning Record:</strong> {user.learningRecord}</p>
          <p><strong>Test Score:</strong> {user.testScore}</p>
        </div>
      )}
    </header>
  )
}

export default Header
