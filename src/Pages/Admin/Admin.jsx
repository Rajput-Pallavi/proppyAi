import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminUpload = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const navigate = useNavigate();

  // Flask API URL
  const API_BASE_URL = 'http://localhost:5000';

  // Cloudinary credentials
  const CLOUD_NAME = 'dsk2vrb6n';
  const UPLOAD_PRESET = 'proppyAI';

  // **CHANGED: Fetch videos from Flask backend**
  useEffect(() => {
    fetchExistingVideos();
  }, []);

  const fetchExistingVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos`);
      
      if (response.ok) {
        const data = await response.json();
        setUploadedVideos(data.videos || []);
        console.log('✅ Loaded videos from backend:', data.count);
      } else {
        console.error('Failed to fetch videos from backend');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Failed to load videos. Make sure Flask server is running on port 5000');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        cloudinaryRef.current = window.cloudinary;
        initializeWidget();
      };
    } else {
      cloudinaryRef.current = window.cloudinary;
      initializeWidget();
    }
  }, []);

  const initializeWidget = () => {
    if (cloudinaryRef.current) {
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          sources: ['local', 'url', 'camera'],
          multiple: true,
          maxFiles: 10,
          resourceType: 'auto',
          clientAllowedFormats: ['mp4', 'mov', 'avi', 'webm', 'jpg', 'png', 'gif'],
          maxFileSize: 104857600,
          maxVideoFileSize: 104857600,
          cropping: false,
          folder: 'shorts',
          tags: ['shorts', 'uploaded-from-admin'],
          context: {
            alt: 'shorts_video',
            caption: 'Uploaded from admin panel'
          },
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#667eea',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#667eea',
              action: '#667eea',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#667eea',
              complete: '#20B832',
              sourceBg: '#E4EBF1'
            }
          }
        },
        (error, result) => {
          console.log('Widget event:', result);
          
          if (!error && result && result.event === 'success') {
            console.log('Upload successful!', result.info);
            
            const uploadedFile = {
              id: result.info.public_id,
              url: result.info.secure_url,
              publicId: result.info.public_id,
              format: result.info.format,
              resourceType: result.info.resource_type,
              width: result.info.width,
              height: result.info.height,
              size: (result.info.bytes / (1024 * 1024)).toFixed(2),
              thumbnail: result.info.thumbnail_url || 
                `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_1,w_400,h_400,c_fill/${result.info.public_id}.jpg`,
              createdAt: result.info.created_at
            };

            // **CHANGED: Use functional update**
            setUploadedVideos(prev => [uploadedFile, ...prev]);
            
            // Save to Flask backend
            saveToDatabase(uploadedFile);
          }
          
          if (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + error.message);
          }
        }
      );
    }
  };

  const openUploadWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  // **CHANGED: Save to Flask backend**
  const saveToDatabase = async (fileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicId: fileData.publicId,
          url: fileData.url,
          format: fileData.format,
          resourceType: fileData.resourceType,
          size: fileData.size,
          createdAt: fileData.createdAt
        })
      });

      if (response.ok) {
        console.log('✅ Saved to database successfully');
      } else {
        console.error('Failed to save to database');
      }
    } catch (error) {
      console.error('Database save error:', error);
    }
  };

  // **CHANGED: Delete via Flask backend**
  const deleteVideo = async (publicId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Encode the public_id for URL
      const encodedId = encodeURIComponent(publicId);
      
      const response = await fetch(`${API_BASE_URL}/api/videos/${encodedId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setUploadedVideos(prev => prev.filter(video => video.publicId !== publicId));
        alert('✅ Video deleted successfully!');
      } else {
        alert('❌ Failed to delete video: ' + data.error);
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete video: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // **NEW: Manual refresh button**
  const handleRefresh = () => {
    fetchExistingVideos();
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>Manage your Shorts content</p>
        </div>
        <div className="header-right">
          <button className="home-btn" onClick={handleBackToHome}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Home
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-card">
            <div className="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <h2>Upload Videos & Images</h2>
            <p>Click the button below to upload content to Cloudinary</p>
            <button className="upload-btn" onClick={openUploadWidget}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Upload Content
            </button>
            <div className="upload-info">
              <p><strong>Supported formats:</strong> MP4, MOV, AVI, WebM, JPG, PNG, GIF</p>
              <p><strong>Max file size:</strong> 100MB per file</p>
              <p><strong>Multiple uploads:</strong> Up to 10 files at once</p>
            </div>
          </div>
        </div>

        {/* Uploaded Videos Grid */}
        <div className="videos-section">
          <div className="section-header">
            <h2>Uploaded Content ({uploadedVideos.length})</h2>
            {/* **NEW: Refresh button** */}
            <button className="refresh-btn" onClick={handleRefresh} disabled={isLoading}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {uploadedVideos.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <h3>No content uploaded yet</h3>
              <p>Start by uploading your first video or image</p>
            </div>
          ) : (
            <div className="videos-grid">
              {uploadedVideos.map((video) => (
                <div key={video.id} className="video-card">
                  <div className="video-thumbnail">
                    {video.resourceType === 'video' ? (
                      <video src={video.url} controls />
                    ) : (
                      <img src={video.url} alt="Uploaded content" />
                    )}
                    <span className="media-badge">
                      {video.resourceType === 'video' ? 'VIDEO' : 'IMAGE'}
                    </span>
                  </div>
                  <div className="video-details">
                    <h4>{video.publicId.split('/').pop()}</h4>
                    <div className="video-meta">
                      <span className="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {video.format.toUpperCase()}
                      </span>
                      <span className="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
                        </svg>
                        {video.size} MB
                      </span>
                      <span className="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        {video.width}x{video.height}
                      </span>
                    </div>
                    <div className="video-actions">
                      <button 
                        className="view-btn"
                        onClick={() => window.open(video.url, '_blank')}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        View
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteVideo(video.publicId)}
                        disabled={isLoading}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
