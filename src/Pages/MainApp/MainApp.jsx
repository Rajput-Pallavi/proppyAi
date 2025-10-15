import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <- import

import Sidebar from '../../Compontents/Sidebar/Sidebar.jsx';
import NewChat from "../NewChat/NewChat";
import Library from "../Library/Library";
import Shorts from "../Shorts/Shorts";
import "./MainApp.css";


const MainApp = () => {
  const navigate = useNavigate(); // <- initialize
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
  }, []);

  // Detect language from text (simple Unicode block detection)
  const detectLanguage = (text) => {
    // Kannada Unicode range: 0C80–0CFF
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0C80 && ch.charCodeAt(0) <= 0x0CFF)) return 'kn';
    // Devanagari (Hindi/Marathi): 0900–097F
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0900 && ch.charCodeAt(0) <= 0x097F)) return 'hi';
    // Bengali: 0980–09FF
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0980 && ch.charCodeAt(0) <= 0x09FF)) return 'bn';
    // Gujarati: 0A80–0AFF
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0A80 && ch.charCodeAt(0) <= 0x0AFF)) return 'gu';
    // Gurmukhi (Punjabi): 0A00–0A7F
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0A00 && ch.charCodeAt(0) <= 0x0A7F)) return 'pa';
    // Oriya: 0B00–0B7F
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0B00 && ch.charCodeAt(0) <= 0x0B7F)) return 'or';
    // Tamil: 0B80–0BFF
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0B80 && ch.charCodeAt(0) <= 0x0BFF)) return 'ta';
    // Telugu: 0C00–0C7F
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0C00 && ch.charCodeAt(0) <= 0x0C7F)) return 'te';
    // Malayalam: 0D00–0D7F
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0D00 && ch.charCodeAt(0) <= 0x0D7F)) return 'ml';
    // Arabic: 0600–06FF
    if ([...text].some(ch => ch.charCodeAt(0) >= 0x0600 && ch.charCodeAt(0) <= 0x06FF)) return 'ar';
    return 'en'; // Default to English
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

    // TTS for answer
    useEffect(() => {
    if (outputText) {
      const langCode = detectLanguage(outputText);
      const voice = getFemaleVoiceForLang(langCode);
      const utterance = new window.SpeechSynthesisUtterance(outputText);
      utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
    }, [outputText]);
  

  // ----------------------
  // Redirect if not logged in
  // ----------------------
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/signin"); // redirect to signin if not logged in
  }, [navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const showPage = (page) => {
    setCurrentPage(page);
    closeSidebar();
  };

  const handleSearch = async () => {
  if (!searchValue) return;
  // TTS for question
  if (searchValue) {
    const langCode = detectLanguage(searchValue);
    const voice = getFemaleVoiceForLang(langCode);
    const questionUtterance = new window.SpeechSynthesisUtterance(searchValue);
    questionUtterance.voice = voice;
    window.speechSynthesis.speak(questionUtterance);
  }
    try {
      const response = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchValue }),
      });
      const data = await response.json();
      setOutputText(data.result);
    } catch (error) {
      setOutputText("Error connecting to backend.");
    }
  };

  return (
    
    <div className="app-container">
      
      <Sidebar
        sidebarOpen={sidebarOpen}
        currentPage={currentPage}
        showPage={showPage}
        closeSidebar={closeSidebar}
      />
      

      <div className="main-content">
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
        
       <div>
      
       </div>
       
      </div>
      
    </div>
  );
};

export default MainApp;
