import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminUpload = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000';
  const CLOUD_NAME = 'dsk2vrb6n';
  const UPLOAD_PRESET = 'proppyAI';

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
      }
    } catch (error) {
      console.error(error);
      alert('Failed to load videos. Make sure Flask server is running.');
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
    if (!cloudinaryRef.current) return;

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: 10,
        resourceType: 'auto',
        clientAllowedFormats: ['mp4', 'mov', 'avi', 'webm', 'jpg', 'png', 'gif'],
        folder: 'shorts',
        tags: ['shorts', 'admin-upload'],
        styles: {
          palette: {
            window: '#FFFFFF',
            tabIcon: '#667eea',
            textDark: '#000000',
            link: '#667eea',
            action: '#667eea',
            complete: '#20B832'
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const uploadedFile = {
            id: result.info.public_id,
            url: result.info.secure_url,
            publicId: result.info.public_id,
            format: result.info.format,
            resourceType: result.info.resource_type,
            width: result.info.width,
            height: result.info.height,
            size: (result.info.bytes / (1024 * 1024)).toFixed(2),
            createdAt: result.info.created_at
          };
          setUploadedVideos(prev => [uploadedFile, ...prev]);
          saveToDatabase(uploadedFile);
        }
      }
    );
  };

  const openUploadWidget = () => widgetRef.current?.open();

  const saveToDatabase = async (fileData) => {
    try {
      await fetch(`${API_BASE_URL}/api/videos/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileData)
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteVideo = async (publicId) => {
    if (!window.confirm('Are you sure?')) return;
    setIsLoading(true);
    try {
      const encodedId = encodeURIComponent(publicId);
      const res = await fetch(`${API_BASE_URL}/api/videos/${encodedId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setUploadedVideos(prev => prev.filter(v => v.publicId !== publicId));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleBackToHome = () => navigate('/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-md shadow-md px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm">Manage your Shorts content</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleBackToHome} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Home
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-10">
        {/* Upload Card */}
        <div className="bg-white rounded-2xl p-10 text-center shadow-lg space-y-5">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Upload Videos & Images</h2>
          <p className="text-gray-600">Click the button below to upload content to Cloudinary</p>
          <button onClick={openUploadWidget} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Upload Content
          </button>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mt-5">
            <p><strong>Formats:</strong> MP4, MOV, AVI, WebM, JPG, PNG, GIF</p>
            <p><strong>Max size:</strong> 100MB per file</p>
            <p><strong>Multiple:</strong> Up to 10 files at once</p>
          </div>
        </div>

        {/* Uploaded Videos */}
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Uploaded Content ({uploadedVideos.length})</h2>
            <button onClick={fetchExistingVideos} disabled={isLoading} className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {uploadedVideos.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <svg className="w-20 h-20 mx-auto mb-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <p>No content uploaded yet</p>
              <p>Start by uploading your first video or image</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uploadedVideos.map(video => (
                <div key={video.id} className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                  <div className="relative w-full h-48 bg-black">
                    {video.resourceType === 'video' ? (
                      <video src={video.url} controls className="w-full h-full object-cover"/>
                    ) : (
                      <img src={video.url} alt="uploaded" className="w-full h-full object-cover"/>
                    )}
                    <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded-full">{video.resourceType.toUpperCase()}</span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-semibold truncate">{video.publicId.split('/').pop()}</h4>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      <span>{video.format.toUpperCase()}</span>
                      <span>{video.size} MB</span>
                      <span>{video.width}x{video.height}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => window.open(video.url, '_blank')} className="flex-1 bg-indigo-600 text-white py-1 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition">
                        View
                      </button>
                      <button onClick={() => deleteVideo(video.publicId)} disabled={isLoading} className="flex-1 bg-red-500 text-white py-1 rounded-lg text-xs font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition">
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
