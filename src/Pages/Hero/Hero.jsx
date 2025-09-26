import React, { useState } from 'react';
import './Hero.css';
import img from '../../assets/img.png'

const Hero = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('newChat');
    const [searchValue, setSearchValue] = useState('');
    const [outputText, setOutputText] = useState('');

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

    const handleSearch = async () => {
        if (!searchValue) return;
        try {
            const response = await fetch('http://localhost:5000/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchValue }),
            });
            const data = await response.json();
            setOutputText(data.result);
        } catch (error) {
            setOutputText('Error connecting to backend.');
        }
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
                
                    
            </div>
            {/* Main Content */}
            <div className="main-content">
                {/* New Chat Page */}
                {currentPage === 'newChat' && (
                    <div className="page active">
                        {/* search bar here */}
                        <div className="search-bar">
                            <input
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                placeholder="Search..."
                                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                            />
                            <button className="search-arrow" onClick={handleSearch} tabIndex={-1}>
                                &gt;
                            </button>
                        </div>
                        <div className="chat-container">
                            <div className="chat-area">
                                <div className="output-text">
                                    {outputText}
                                </div>
                            </div>
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