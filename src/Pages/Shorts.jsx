import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Shorts = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [videosData, setVideosData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:5000'
    : 'https://proppyai.onrender.com';

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

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black relative overflow-hidden">
        <div className="flex flex-col items-center justify-center h-screen text-white">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
          <p className="mt-5 text-lg">Loading Shorts...</p>
        </div>
      </div>
    );
  }

  if (videosData.length === 0) {
    return (
      <div className="w-full h-screen bg-black relative overflow-hidden">
        <div className="fixed top-0 left-0 right-0 flex items-center gap-4 px-5 py-4 bg-gradient-to-b from-black/80 to-transparent z-50">
          <button 
            onClick={handleBackClick}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur border-0 flex items-center justify-center cursor-pointer hover:bg-white/25 hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-6 h-6 stroke-white stroke-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow-lg m-0">Shorts</h2>
        </div>

        <div className="flex flex-col items-center justify-center h-[80vh] text-white text-center px-5">
          <svg className="w-20 h-20 stroke-gray-600 stroke-1.5 mb-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <h3 className="text-2xl mb-2.5 font-bold">No Shorts Available</h3>
          <p className="text-base text-gray-300 mb-8">Upload some videos from the admin panel!</p>
          <button 
            onClick={fetchVideos}
            className="flex items-center gap-2.5 px-6 py-3 bg-indigo-600 text-white border-0 rounded-2xl text-base font-semibold cursor-pointer hover:bg-indigo-500 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5 stroke-white stroke-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden" ref={containerRef}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 flex items-center gap-4 px-5 py-4 bg-gradient-to-b from-black/80 to-transparent z-50">
        <button 
          onClick={handleBackClick}
          className="w-10 h-10 rounded-full bg-white/15 backdrop-blur border-0 flex items-center justify-center cursor-pointer hover:bg-white/25 hover:scale-105 active:scale-95 transition-all"
        >
          <svg className="w-6 h-6 stroke-white stroke-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
        <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow-lg m-0">Shorts</h2>
      </div>

      {/* Video Feed */}
      <div className="w-full h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-hide">
        {videosData.map((video, index) => (
          <div key={video.id} className="w-full h-screen relative snap-start snap-always bg-black">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-full h-full object-cover bg-black cursor-pointer"
              src={video.url}
              loop
              playsInline
              preload="metadata"
              onClick={() => handleVideoClick(index)}
            />

            {/* Video Overlay */}
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-between items-end px-5 pb-5 pt-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
              {/* Video Info */}
              <div className="flex-1 text-white pb-2.5 max-w-[70%] pointer-events-auto">
                <p className="text-base font-bold m-0 mb-2 drop-shadow-lg cursor-pointer hover:underline">@{video.username}</p>
                <p className="text-sm m-0 leading-6 line-clamp-3 drop-shadow-lg">{video.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-6 items-center pb-2.5 pointer-events-auto">
                {/* Profile Button */}
                <button 
                  onClick={() => handleProfileClick(video.username)}
                  className="relative mb-1 bg-none border-0 text-white cursor-pointer flex flex-col items-center gap-1.5 hover:scale-125 active:scale-90 transition-transform"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden drop-shadow-lg">
                    <img src={video.profilePic} alt={video.username} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-lg font-bold text-white border-2 border-black drop-shadow">+</div>
                </button>

                {/* Like Button */}
                <button 
                  onClick={() => handleLike(video.id)}
                  className="bg-none border-0 text-white cursor-pointer flex flex-col items-center gap-1.5 hover:scale-125 active:scale-90 transition-transform"
                >
                  <svg className="w-8 h-8 stroke-white stroke-2 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span className="text-xs font-bold drop-shadow">{video.likes}</span>
                </button>

                {/* Comment Button */}
                <button 
                  onClick={() => handleComment(video.id)}
                  className="bg-none border-0 text-white cursor-pointer flex flex-col items-center gap-1.5 hover:scale-125 active:scale-90 transition-transform"
                >
                  <svg className="w-8 h-8 stroke-white stroke-2 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span className="text-xs font-bold drop-shadow">{video.comments}</span>
                </button>

                {/* Share Button */}
                <button 
                  onClick={() => handleShare(video.id)}
                  className="bg-none border-0 text-white cursor-pointer flex flex-col items-center gap-1.5 hover:scale-125 active:scale-90 transition-transform"
                >
                  <svg className="w-8 h-8 stroke-white stroke-2 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="16 6 12 2 8 6"/>
                    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  <span className="text-xs font-bold drop-shadow">Share</span>
                </button>

                {/* More Options Button */}
                <button className="bg-none border-0 text-white cursor-pointer flex flex-col items-center gap-1.5 hover:scale-125 active:scale-90 transition-transform">
                  <svg className="w-8 h-8 stroke-white stroke-2 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};

export default Shorts;