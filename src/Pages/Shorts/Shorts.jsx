import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Shorts.css';
import logo from '../../assets/logo.png';

const Shorts = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Replace with your actual Cloudinary cloud name
  const CLOUD_NAME = 'your_cloud_name';

  // Sample video data - replace with data from your backend/database
  const videosData = [
    {
      id: 1,
      public_id: 'shorts/video1',
      username: 'user1',
      description: 'Amazing content! #shorts',
      likes: '12K',
      comments: '234',
      profilePic: 'https://via.placeholder.com/50'
    },
    {
      id: 2,
      public_id: 'shorts/video2',
      username: 'user2',
      description: 'Check this out! #viral',
      likes: '45K',
      comments: '890',
      profilePic: 'https://via.placeholder.com/50'
    },
    {
      id: 3,
      public_id: 'shorts/video3',
      username: 'user3',
      description: 'Trending now! #fyp',
      likes: '23K',
      comments: '456',
      profilePic: 'https://via.placeholder.com/50'
    }
  ];

  // Generate Cloudinary video URL with transformations
  const getCloudinaryVideoUrl = (publicId) => {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/` +
           `q_auto,` +
           `f_auto,` +
           `c_fill,w_1080,h_1920,g_auto/` +
           `${publicId}.mp4`;
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
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

  // Intersection Observer for auto-play on scroll
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
  }, []);

  // Toggle play/pause on video click
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

  return (
    <div className="shorts-container" ref={containerRef}>
      {/* Header with Back Button */}
      <div className="shorts-header">
        <button className="back-button" onClick={handleBackClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <img src={logo} alt="Logo" className="shorts-logo" />
        <h2>Shorts</h2>
      </div>

      {/* Video Feed */}
      <div className="shorts-feed">
        {videosData.map((video, index) => (
          <div key={video.id} className="short-video-wrapper">
            {/* Cloudinary Video Element */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="short-video"
              src={getCloudinaryVideoUrl(video.public_id)}
              loop
              playsInline
              preload="metadata"
              onClick={() => handleVideoClick(index)}
            />

            {/* Video Overlay - Info & Controls */}
            <div className="video-overlay">
              {/* Bottom Info Section */}
              <div className="video-info">
                <p className="video-username">@{video.username}</p>
                <p className="video-description">{video.description}</p>
              </div>

              {/* Side Action Buttons */}
              <div className="video-actions">
                {/* Profile Button */}
                <button 
                  className="action-btn profile-btn"
                  onClick={() => handleProfileClick(video.username)}
                >
                  <div className="profile-pic">
                    <img src={video.profilePic} alt={video.username} />
                  </div>
                  <div className="follow-icon">+</div>
                </button>

                {/* Like Button */}
                <button 
                  className="action-btn" 
                  onClick={() => handleLike(video.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>{video.likes}</span>
                </button>

                {/* Comment Button */}
                <button 
                  className="action-btn"
                  onClick={() => handleComment(video.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>{video.comments}</span>
                </button>

                {/* Share Button */}
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

                {/* More Options Button */}
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
