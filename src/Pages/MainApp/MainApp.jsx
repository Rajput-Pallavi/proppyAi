import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from '../../Compontents/Sidebar.jsx';
import NewChat from "../NewChat/NewChat";
import Library from "../Library/Library";
import Shorts from "../Shorts/Shorts";
import "./MainApp.css";

const MainApp = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("newChat");
  const [searchValue, setSearchValue] = useState("");
  const [outputText, setOutputText] = useState("");

  // Store all voices
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();
    
    // Cleanup on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Detect language from text (simple Unicode block detection)
  const detectLanguage = (text) => {
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0C80 && ch.charCodeAt(0) <= 0x0CFF)) return 'kn';
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0900 && ch.charCodeAt(0) <= 0x097F)) return 'hi';
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0980 && ch.charCodeAt(0) <= 0x09FF)) return 'bn';
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0A80 && ch.charCodeAt(0) <= 0x0AFF)) return 'gu';
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0A00 && ch.charCodeAt(0) <= 0x0A7F)) return 'pa';
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0B00 && ch.charCodeAt(0) <= 0x0B7F)) return 'or';
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0B80 && ch.charCodeAt(0) <= 0x0BFF)) return 'ta';
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0C00 && ch.charCodeAt(0) <= 0x0C7F)) return 'te';
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0D00 && ch.charCodeAt(0) <= 0x0D7F)) return 'ml';
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0600 && ch.charCodeAt(0) <= 0x06FF)) return 'ar';
    return 'en';
  };

  // Get a female voice for a language code
  const getFemaleVoiceForLang = (langCode) => {
    const femaleKeywords = ['female', 'woman', 'girl', 'zira', 'eva', 'susan', 'heather', 'linda', 'mary', 'anna', 'karen', 'victoria', 'hazel', 'allison', 'amy', 'emma', 'julie', 'lucy', 'naomi', 'serena', 'tessa'];
    let voice = voices.find(v => v.lang.startsWith(langCode) && femaleKeywords.some(k => v.name.toLowerCase().includes(k)));
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith(langCode));
    }
    if (!voice && voices.length > 0) {
      voice = voices[0];
    }
    return voice;
  };

  // TTS for answer with cleanup
  useEffect(() => {
    if (outputText && voices.length > 0) {
      const langCode = detectLanguage(outputText);
      const voice = getFemaleVoiceForLang(langCode);
      const utterance = new window.SpeechSynthesisUtterance(outputText);
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
      };
      
      window.speechSynthesis.speak(utterance);
    }
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [outputText, voices]);

  // Redirect if not logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/signin");
  }, [navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const showPage = (page) => {
    setCurrentPage(page);
    closeSidebar();
  };

  const handleSearch = async () => {
    if (!searchValue) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Small delay to ensure cancellation completes
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // TTS for question
    if (searchValue && voices.length > 0) {
      const langCode = detectLanguage(searchValue);
      const voice = getFemaleVoiceForLang(langCode);
      const questionUtterance = new window.SpeechSynthesisUtterance(searchValue);
      if (voice) {
        questionUtterance.voice = voice;
      }
      
      questionUtterance.onerror = (event) => {
        console.error('Question speech error:', event.error);
      };
      
      window.speechSynthesis.speak(questionUtterance);
    }
    
    // Determine backend URL based on host
    const API_URL = window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://proppyai.onrender.com";
      
    try {
      const response = await fetch(`${API_URL}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchValue }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOutputText(data.result);
    } catch (error) {
      console.error("Backend connection error:", error);
      setOutputText("Error connecting to backend. Please check if the server is running.");
    }
  };

  return (
    <div className="app-container">
      {/* Animated background elements */}
      <div className="background-decorations">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <Sidebar
        sidebarOpen={sidebarOpen}
        currentPage={currentPage}
        showPage={showPage}
        closeSidebar={closeSidebar}
      />

      <div className={`main-content ${sidebarOpen ? 'sidebar-active' : ''}`}>
        <div className="content-wrapper">
          {currentPage === "newChat" && (
            <NewChat
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              handleSearch={handleSearch}
              outputText={outputText}
            />
          )}
          {currentPage === "library" && <Library />}
          {currentPage === "shorts" && <Shorts />}
        </div>
      </div>
    </div>
  );
};

export default MainApp;
