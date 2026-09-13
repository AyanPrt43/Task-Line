import React, { useState } from "react";
import useDataHook from "../context/Context";

const MainContent = () => {

    const {addTask, filter, setFilter, userProfile} = useDataHook();

    const active = filter;
    const setActive = setFilter;

    const[task, setTask] = useState("")

    const add = (e) =>{
        e.preventDefault()

        if(!task) return

        addTask({task, completed:false});
        setTask("")
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        if (hour < 21) return 'Good Evening';
        return 'Good Night';
    };
    
    const displayName = userProfile ? (userProfile.nickname || userProfile.firstName) : "User";

  return (
    <div className="w-full shrink-0 bg-white/20 dark:bg-black/20 backdrop-blur-[40px] p-4 sm:p-5 pr-5 sm:pr-7 border-b border-white/40 dark:border-white/10">
      <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white drop-shadow-sm">
        {getGreeting()}, {displayName} 👋
      </p>
      <p className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold text-black/70 dark:text-white/70">
        Let's make today productive!
      </p>
      <form onSubmit={add} className="mt-4 sm:mt-5 flex items-center justify-center gap-2 sm:gap-4 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/20 shadow-sm rounded-full w-full h-14 sm:h-16">
        <p className="-translate-y-0.5 h-full rounded-l-full w-10 sm:w-14 flex justify-end text-xl sm:text-2xl items-center text-black/60 dark:text-white/60">
          +
        </p>

        <input
          id="AddedTaskContent"
          className="w-full outline-none text-base bg-transparent text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <button id="AddTaskButton" className="text-3xl sm:text-4xl bg-white/40 dark:bg-black/40 border border-white/50 dark:border-white/20 shadow-sm text-black dark:text-white h-[80%] rounded-full w-10 sm:w-12 mr-2 sm:mr-4 flex justify-center items-center cursor-pointer hover:transition-all duration-500 hover:scale-105 hover:bg-white/60 dark:hover:bg-black/60 shrink-0">
          <span className="-translate-y-0.75">+</span>
        </button>
      </form>

      <div className="mt-4 sm:mt-5 w-full flex gap-2 sm:gap-4 flex-wrap">
        {["All", "Today", "Important", "Complete"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActive(tab)}
            className={`${active === tab ? 'bg-white/60 dark:bg-black/60 shadow-md border-white/50 dark:border-white/20' : 'bg-white/20 dark:bg-black/20 border-transparent hover:bg-white/40 dark:hover:bg-black/40'} border backdrop-blur-md flex justify-center px-4 sm:px-5 py-1 text-sm sm:text-base rounded-full cursor-pointer transition-all duration-300 hover:scale-105 text-black dark:text-white font-medium`}
          >
            <p>{tab}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
