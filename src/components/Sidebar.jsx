import React from "react";
import useDataHook from "../context/Context";

const Sidebar = ({ isOpen = true, onToggle, onClose }) => {
  const { filter, setFilter, trashCount } = useDataHook();

  const active = filter;
  const handleClick = (filterName) => {
    setFilter(filterName);
    onClose?.();
  };

  return (
    <div className={`h-full bg-white/20 dark:bg-black/20 backdrop-blur-[40px] overflow-x-hidden overflow-y-auto flex flex-col transition-all duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-r border-white/40 dark:border-white/10 ${isOpen ? 'px-5' : 'px-2'}`}>
      
      {/* Header section */}
      <div className={`flex items-center pt-5 mb-8 ${isOpen ? 'justify-between pr-2' : 'justify-center'}`}>
        
        {/* Logo and title */}
        <div className={`cursor-pointer flex items-center shrink-0 ${isOpen ? '' : 'hidden'}`}>
          <svg className="inline mr-1 shrink-0" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="checkGradient" x1="10" y1="10" x2="38" y2="38">
                <stop offset="0%" stopColor="#5B5CFF" />
                <stop offset="100%" stopColor="#4338CA" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect x="5" y="5" width="38" height="38" rx="5" fill="white" stroke="#8B5CF6" strokeWidth="2" filter="url(#glow)" />
            <path d="M13 24L21 32L36 15" stroke="url(#checkGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold text-black/80 dark:text-white/95 text-2xl whitespace-nowrap">
            Task Line
          </span>
        </div>



        {/* Close Button (Mobile) */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-full hover:bg-white/20 transition text-black dark:text-white cursor-pointer shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1">
        {/* Tasks */}
        <div
          onClick={() => handleClick("All")}
          title="All Tasks"
          className={`flex items-center mb-4 p-2 rounded-2xl cursor-pointer hover:bg-white/40 dark:hover:bg-black/40 transition-all border border-transparent ${active === "All" ? "bg-white/50 dark:bg-black/50 shadow-md border-white/50 dark:border-white/20" : ""} ${isOpen ? '' : 'justify-center w-12 mx-auto'}`}
        >
          <svg className={`font-bold flex items-center text-black dark:text-white shrink-0 ${isOpen ? 'mr-3' : 'mr-0'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
            <path d="M9 21v-6h6v6" />
          </svg>
          <span className={`text-black dark:text-white/95 font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Tasks</span>
        </div>

        {/* Today */}
        <div
          onClick={() => handleClick("Today")}
          title="Today"
          className={`flex items-center mb-4 p-2 rounded-2xl cursor-pointer hover:bg-white/40 dark:hover:bg-black/40 transition-all border border-transparent ${active === "Today" ? "bg-white/50 dark:bg-black/50 shadow-md border-white/50 dark:border-white/20" : ""} ${isOpen ? '' : 'justify-center w-12 mx-auto'}`}
        >
          <svg className={`font-bold flex items-center text-black dark:text-white shrink-0 ${isOpen ? 'mr-3' : 'mr-0'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
            <path d="M8 14h2M14 14h2M8 18h2" />
          </svg>
          <span className={`text-black dark:text-white/95 font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Today</span>
        </div>

        {/* Important */}
        <div
          onClick={() => handleClick("Important")}
          title="Important"
          className={`flex items-center mb-4 p-2 rounded-2xl cursor-pointer hover:bg-white/40 dark:hover:bg-black/40 transition-all border border-transparent ${active === "Important" ? "bg-white/50 dark:bg-black/50 shadow-md border-white/50 dark:border-white/20" : ""} ${isOpen ? '' : 'justify-center w-12 mx-auto'}`}
        >
          <svg className={`font-bold flex items-center text-black dark:text-white shrink-0 ${isOpen ? 'mr-3' : 'mr-0'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" />
          </svg>
          <span className={`text-black dark:text-white/95 font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Important</span>
        </div>

        {/* Planned */}
        <div
          onClick={() => handleClick("Planned")}
          title="Planned"
          className={`flex items-center mb-4 p-2 rounded-2xl cursor-pointer hover:bg-white/40 dark:hover:bg-black/40 transition-all border border-transparent ${active === "Planned" ? "bg-white/50 dark:bg-black/50 shadow-md border-white/50 dark:border-white/20" : ""} ${isOpen ? '' : 'justify-center w-12 mx-auto'}`}
        >
          <svg className={`font-bold flex items-center text-black dark:text-white shrink-0 ${isOpen ? 'mr-3' : 'mr-0'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span className={`text-black dark:text-white/95 font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Planned</span>
        </div>

        {/* Complete */}
        <div
          onClick={() => handleClick("Complete")}
          title="Complete"
          className={`flex items-center mb-4 p-2 rounded-2xl cursor-pointer hover:bg-white/40 dark:hover:bg-black/40 transition-all border border-transparent ${active === "Complete" ? "bg-white/50 dark:bg-black/50 shadow-md border-white/50 dark:border-white/20" : ""} ${isOpen ? '' : 'justify-center w-12 mx-auto'}`}
        >
          <svg className={`font-bold flex items-center text-black dark:text-white shrink-0 ${isOpen ? 'mr-3' : 'mr-0'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className={`text-black dark:text-white/95 font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Complete</span>
        </div>
      </div>

      {/* Trash Menu Item */}
      <div className={`mt-auto pt-4 mb-4 ${isOpen ? 'border-t border-white/20 dark:border-white/10' : ''}`}>
        <div
          onClick={() => handleClick("Trash")}
          title="Trash"
          className={`flex items-center mb-4 p-2 rounded-full cursor-pointer hover:bg-white/5 dark:hover:bg-black/10 transition-colors ${active === "Trash" ? "bg-white/15 dark:bg-black/20" : ""} relative ${isOpen ? '' : 'justify-center w-12 mx-auto'}`}
        >
          <svg className={`font-bold flex items-center text-black dark:text-white shrink-0 ${isOpen ? 'mr-3' : 'mr-0'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16" />
            <path d="M10 11v6M14 11v6" />
            <path d="M6 7l1 14h10l1-14" />
            <path d="M9 7V4h6v3" />
          </svg>
          <span className={`text-black/80 dark:text-white/90 whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Trash</span>
          
          {trashCount > 0 && (
            isOpen ? (
              <span className="ml-auto mr-2 bg-red-500/80 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
                {trashCount}
              </span>
            ) : (
              <span className="absolute top-1 right-1 bg-red-500/80 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {trashCount}
              </span>
            )
          )}
        </div>
      </div>

      <div className={`mt-auto pt-8 dark:text-white/50 pb-8 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
        <p className="ml-1 whitespace-nowrap">"Dicipline</p>
        <p className="whitespace-nowrap">today, Freedom</p>
        <p className="whitespace-nowrap">tomorrow"</p>
        <div className="h-0.5 w-11 bg-linear-to-r from-blue-200 via-blue-400 to-blue-600 dark:bg-linear-to-r from-gray-800 via-blue-700 to-gray-900 rounded-full mt-5"></div>
      </div>
    </div>
  );
};

export default Sidebar;
