import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import useDataHook from "../context/Context";
import { auth } from "../firebase";
import ProfileSettingsModal from "./ProfileSettingsModal";

const Header = ({ onMenuToggle }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState(null);
  const searchInputRef = useRef(null);
  const profileRef = useRef(null);

  const { themeMode, darkMode, lightMode, searchQuery, setSearchQuery, userProfile } = useDataHook();



  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchToggle = () => {
    if (searchOpen && searchQuery) {
      setSearchQuery("");
    }
    setSearchOpen(!searchOpen);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <div className="relative z-50 w-full bg-white/20 dark:bg-black/20 backdrop-blur-md flex flex-col justify-end shrink-0 border-b md:border-b-0 md:border-l border-white/40 dark:border-white/10 pt-[env(safe-area-inset-top)]">
      <div className="h-14 sm:h-16 w-full flex gap-2 sm:gap-3 justify-end items-center px-3 sm:px-6">
        
        {/* Hamburger menu removed for mobile as sidebar is disabled */}

        {/* Search bar — expands inline */}
        {searchOpen && (
          <div className="flex-1 flex items-center mx-1 sm:mx-2 max-w-sm md:max-w-xs">
            <div className="flex items-center w-full bg-white/40 dark:bg-black/40 rounded-full px-3 py-1.5 gap-2 backdrop-blur-xl border border-white/50 dark:border-white/20 shadow-sm">
              <svg className="text-black/60 dark:text-white/60 shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-transparent outline-none text-base text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white cursor-pointer shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div id="ThemeToggleButton" onClick={() => themeMode === 'light' ? darkMode() : lightMode()} className="cursor-pointer transition-transform hover:scale-110 active:scale-95">
            {themeMode === 'dark' ? (
              <svg
                className="text-white drop-shadow-md"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                className="text-black/80 drop-shadow-sm"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </div>

          {/* Search toggle button */}
          <button
            id="searchIcon"
            onClick={handleSearchToggle}
            className={`p-1 rounded-full transition cursor-pointer ${searchOpen ? "bg-white/40 dark:bg-black/40 shadow-inner border border-white/50 dark:border-white/10" : "hover:bg-white/30 dark:hover:bg-black/30"}`}
          >
            <svg
              className="text-black dark:text-white/90"
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {searchOpen ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </>
              )}
            </svg>
          </button>

          <div 
            ref={profileRef}
            className="relative"
          >
            <div 
              onClick={() => setProfileOpen(!profileOpen)}
              className="h-10 w-10 sm:h-11 sm:w-11 bg-black/20 dark:bg-white/20 rounded-full flex justify-center items-center cursor-pointer hover:bg-black/30 dark:hover:bg-white/30 transition shadow-sm border border-black/10 dark:border-white/10 bg-cover bg-center"
              style={(userProfile && userProfile.avatar && (userProfile.avatar.startsWith('data:image') || userProfile.avatar.startsWith('http'))) ? { backgroundImage: `url(${userProfile.avatar})` } : {}}
            >
              {!(userProfile && userProfile.avatar && (userProfile.avatar.startsWith('data:image') || userProfile.avatar.startsWith('http'))) && (
                <p className="text-xl sm:text-2xl font-bold text-black/80 dark:text-white/90">{userProfile ? userProfile.avatar : "A"}</p>
              )}
            </div>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 dark:bg-black/95 md:bg-white/70 md:dark:bg-black/70 backdrop-blur-[60px] rounded-2xl border border-white/50 dark:border-white/20 shadow-2xl z-50 overflow-hidden animate-fadeIn">
                
                <div className="p-4 bg-white/90 dark:bg-black/90 md:bg-white/60 md:dark:bg-black/60 border-b border-white/50 dark:border-white/10 flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 border-white/50 dark:border-white/20 bg-black/5 dark:bg-white/5 shadow-sm relative overflow-hidden bg-cover bg-center"
                    style={(userProfile && userProfile.avatar && (userProfile.avatar.startsWith('data:image') || userProfile.avatar.startsWith('http'))) ? { backgroundImage: `url(${userProfile.avatar})` } : {}}
                  >
                    {!(userProfile && userProfile.avatar && (userProfile.avatar.startsWith('data:image') || userProfile.avatar.startsWith('http'))) && (
                      <p className="text-xl font-bold text-black/80 dark:text-white/90">{userProfile ? userProfile.avatar : "A"}</p>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-bold text-black/80 dark:text-white/90 truncate">
                      {userProfile ? userProfile.nickname || `${userProfile.firstName} ${userProfile.lastName}` : "User"}
                    </p>
                    <p className="text-xs text-black/60 dark:text-white/60 truncate">
                      {userProfile ? userProfile.email : "user@example.com"}
                    </p>
                  </div>
                </div>
                <div className="p-2">
                  <div 
                    onClick={() => { setProfileOpen(false); setActiveProfileTab('account'); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/40 dark:hover:bg-black/40 cursor-pointer text-sm text-black/80 dark:text-white/90 transition-colors font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    My Account
                  </div>

                  <div 
                    onClick={() => { setProfileOpen(false); setActiveProfileTab('about'); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/40 dark:hover:bg-black/40 cursor-pointer text-sm text-black/80 dark:text-white/90 transition-colors font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    About Developer
                  </div>
                  
                  <div 
                    onClick={() => { setProfileOpen(false); setActiveProfileTab('settings'); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/40 dark:hover:bg-black/40 cursor-pointer text-sm text-black/80 dark:text-white/90 transition-colors font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Settings
                  </div>
                </div>

                <div className="p-2 border-t border-black/10 dark:border-white/10">
                  <div 
                    onClick={() => {
                      auth.signOut().then(() => {
                        window.location.reload();
                      });
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 cursor-pointer text-sm text-red-600 dark:text-red-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {activeProfileTab && createPortal(
          <ProfileSettingsModal 
            activeTab={activeProfileTab} 
            onClose={() => setActiveProfileTab(null)} 
          />,
          document.body
        )}
      </div>
    </div>
  );
};

export default Header;
