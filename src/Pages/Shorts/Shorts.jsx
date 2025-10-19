import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Shorts.css';
import logo from '../../assets/logo.png';

const Shorts = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [videosData, setVideosData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Flask API URL
    const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:5000'   // Local backend
  : 'https://proppyai.onrender.com'; // Deployed backend

  // Fetch videos from Flask backend on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Fetching videos from Flask backend...');
      
      const response = await fetch(`${API_BASE_URL}/api/videos`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Received data:', data);
        
        if (data.videos && data.videos.length > 0) {
          const videos = data.videos.map((resource, index) => ({
            id: index + 1,
            public_id: resource.publicId,
            url: resource.url,
            username: 'user' + (index + 1),
            description: 'Amazing content! #shorts #viral #trending',
            likes: Math.floor(Math.random() * 100) + 'K',
            comments: Math.floor(Math.random() * 1000),
            profilePic: `https://ui-avatars.com/api/?name=User${index + 1}&background=667eea&color=fff&size=50`
          }));

          setVideosData(videos);
          console.log('✅ Loaded videos in Shorts:', videos.length);
        } else {
          console.log('⚠️ No videos found in response');
        }
      } else {
        console.error('❌ Failed to fetch videos. Status:', response.status);
        alert('Failed to load videos. Make sure Flask server is running on port 5000');
      }
    } catch (error) {
      console.error('❌ Error fetching videos:', error);
      alert('Cannot connect to Flask server. Make sure it\'s running on http://localhost:5000');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Handle video play/pause based on visibility
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideo) {
          video.play().catch(err => console.log('Play error:', err));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentVideo]);

  // Intersection Observer for auto-play
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.75
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const videoIndex = videoRefs.current.findIndex(
            (ref) => ref === entry.target
          );
          if (videoIndex !== -1) {
            setCurrentVideo(videoIndex);
          }
        }
      });
    }, options);

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videosData]);

  const handleVideoClick = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleLike = (videoId) => {
    console.log('Liked video:', videoId);
  };

  const handleComment = (videoId) => {
    console.log('Comment on video:', videoId);
  };

  const handleShare = (videoId) => {
    console.log('Share video:', videoId);
  };

  const handleProfileClick = (username) => {
    console.log('View profile:', username);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="shorts-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading Shorts...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (videosData.length === 0) {
    return (
      <div className="shorts-container">
        <div className="shorts-header">
          <button className="back-button" onClick={handleBackClick}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <img src={logo} alt="Logo" className="shorts-logo" />
          <h2>Shorts</h2>
        </div>
        <div className="empty-shorts">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <h3>No Shorts Available</h3>
          <p>Upload some videos from the admin panel!</p>
          <button className="refresh-shorts-btn" onClick={fetchVideos}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shorts-container" ref={containerRef}>
      <div className="shorts-header">
        <button className="back-button" onClick={handleBackClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <img src={logo} alt="Logo" className="shorts-logo" />
        <h2>Shorts</h2>
      </div>

      <div className="shorts-feed">
        {videosData.map((video, index) => (
          <div key={video.id} className="short-video-wrapper">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="short-video"
              src={video.url}
              loop
              playsInline
              preload="metadata"
              onClick={() => handleVideoClick(index)}
            />

            <div className="video-overlay">
              <div className="video-info">
                <p className="video-username">@{video.username}</p>
                <p className="video-description">{video.description}</p>
              </div>

              <div className="video-actions">
                <button 
                  className="action-btn profile-btn"
                  onClick={() => handleProfileClick(video.username)}
                >
                  <div className="profile-pic">
                    <img src={video.profilePic} alt={video.username} />
                  </div>
                  <div className="follow-icon">+</div>
                </button>

                <button 
                  className="action-btn" 
                  onClick={() => handleLike(video.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>{video.likes}</span>
                </button>

                <button 
                  className="action-btn"
                  onClick={() => handleComment(video.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>{video.comments}</span>
                </button>

                <button 
                  className="action-btn"
                  onClick={() => handleShare(video.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="16 6 12 2 8 6"/>
                    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  <span>Share</span>
                </button>

                <button className="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="1" strokeWidth="2"/>
                    <circle cx="12" cy="5" r="1" strokeWidth="2"/>
                    <circle cx="12" cy="19" r="1" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shorts;
