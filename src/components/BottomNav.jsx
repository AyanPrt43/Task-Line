import React from "react";
import useDataHook from "../context/Context";

const BottomNav = () => {
  const { filter, setFilter, trashCount } = useDataHook();

  const tabs = [
    {
      id: "All",
      label: "Tasks",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={filter === "All" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: "Today",
      label: "Today",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      id: "Important",
      label: "Important",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={filter === "Important" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    {
      id: "Planned",
      label: "Planned",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      id: "Complete",
      label: "Completed",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2.5 2.5L16 9" />
        </svg>
      )
    },
    {
      id: "Trash",
      label: "Trash",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/20 dark:bg-black/20 backdrop-blur-[40px] z-40 md:hidden flex justify-between items-center px-1 sm:px-3 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pt-4 sm:pb-[calc(2rem+env(safe-area-inset-bottom))] border-t border-white/50 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[32px]">
      {tabs.map((tab) => {
        const isActive = filter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-300 relative ${isActive ? 'text-black dark:text-white transform -translate-y-1' : 'text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80'}`}
          >
            <div className={`mb-1 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : ''}`}>
              {tab.icon}
            </div>
            <span className={`text-[10px] sm:text-xs font-semibold transition-all duration-300 ${isActive ? 'opacity-100 font-bold' : 'opacity-70'}`}>
              {tab.label}
            </span>
            {/* Trash Badge */}
            {tab.id === 'Trash' && trashCount > 0 && (
              <div className="absolute top-0 right-2 sm:right-3 bg-red-500/90 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full shadow-md pointer-events-none">
                {trashCount}
              </div>
            )}

            {/* Active Indicator dot */}
            {isActive && <div className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white absolute -bottom-2"></div>}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
