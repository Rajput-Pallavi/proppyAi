import React, { useState } from 'react';
import './Hero.css';
import img from '../../assets/img.png'

const Hero = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('newChat');

    const openSidebar = () => {
        setSidebarOpen(true);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const showPage = (page) => {
        setCurrentPage(page);
        closeSidebar();
    };

    const handleOverlayClick = () => {
        closeSidebar();
    };

    return (
        <div className="app-container">
            {/* Overlay */}
            <div 
                className={`overlay ${sidebarOpen ? 'active' : ''}`} 
                onClick={handleOverlayClick}
            ></div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>Menu</h3>
                </div>
                <div className="sidebar-menu">
                    <button 
                        className={`menu-item ${currentPage === 'newChat' ? 'active' : ''}`}
                        onClick={() => showPage('newChat')}
                    >
                        <span>💬</span> New Chat
                    </button>
                    <button 
                        className={`menu-item ${currentPage === 'library' ? 'active' : ''}`}
                        onClick={() => showPage('library')}
                    >
                        <span>📚</span> Library
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="header">
                <button className="menu-btn" onClick={toggleSidebar}>
                    ☰ Menu
                </button>
                <div className="logo">Proppy Ai</div>
                <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* New Chat Page */}
                {currentPage === 'newChat' && (
                    <div className="page active">
                        <div className="chat-container">
                            <div className="chat-area"></div>
                            <div className="character-placeholder">
                                <img src={img} alt="" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Library Page */}
                {currentPage === 'library' && (
                    <div className="page active">
                        <div className="library-container">
                            <div className="empty-state">
                                <h2>📚 Library</h2>
                                <p>This is your library page. It's currently empty.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hero;