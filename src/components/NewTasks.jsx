import { useState, useRef, useEffect } from "react";
import useDataHook from "../context/Context";

const NewTasks = ({ task, isTrashView }) => {
  const [edit, setEdit] = useState(false);
  const [taskcontent, setTaskContent] = useState(task.task);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dateRef = useRef(null);
  const textareaRef = useRef(null);

  const { deleteTask, permanentDeleteTask, restoreTask, updateTask, toggleCompleted, toggleImportant, setTaskDate } = useDataHook();

  // Close date picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-resize textarea when editing expanded tasks
  useEffect(() => {
    if (edit && isExpanded && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    } else if (textareaRef.current && !isExpanded) {
      textareaRef.current.style.height = "auto";
    }
  }, [edit, isExpanded, taskcontent]);

  // Edit / Save task
  const editTask = () => {
    updateTask(task.id, {
      ...task,
      task: taskcontent,
    });
    setEdit(false);
    setIsExpanded(false);
  };

  // Complete / Uncomplete task
  const togglecomplete = () => {
    toggleCompleted(task.id);
  };

  // Date helpers
  const getTodayString = () => new Date().toISOString().split("T")[0];
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const getDateLabel = () => {
    if (!task.date) return null;
    const today = getTodayString();
    const tomorrow = getTomorrowString();
    if (task.date === today) return "Today";
    if (task.date === tomorrow) return "Tomorrow";
    // Format as short date
    const d = new Date(task.date + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Trash view — show restore and permanent delete
  if (isTrashView) {
    return (
      <div className="w-full h-20 sm:h-16 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-full mb-4 flex items-center p-2 pl-3 sm:pl-4 pr-2 sm:pr-4 gap-2 sm:gap-4 mt-3 opacity-60">
        {/* Task Content */}
        <div className="h-full flex-1 min-w-0 text-black dark:text-white flex items-center truncate line-through">
          <span>{task.task}</span>
        </div>

        {/* Restore Button */}
        <button
          onClick={() => restoreTask(task.id)}
          title="Restore"
          className="p-2 rounded-full backdrop-blur-md hover:bg-green-500/30 transition cursor-pointer text-black dark:text-white shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        {/* Permanent Delete */}
        <button
          onClick={() => permanentDeleteTask(task.id)}
          title="Delete permanently"
          className="p-2 rounded-full backdrop-blur-md hover:bg-red-500/30 transition cursor-pointer text-red-400 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M6 7l1 14h10l1-14" />
            <path d="M9 7V4h6v3" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-[80px] sm:min-h-[64px] h-auto py-7 sm:py-5 rounded-[32px] mb-4 hover:transition-all duration-600 hover:scale-[1.015] flex mt-3 backdrop-blur-md shadow-sm ${
      isExpanded 
        ? "flex-wrap justify-center items-center gap-4 px-4 sm:px-6" 
        : "items-start px-2 pl-3 sm:pl-4 pr-2 sm:pr-4 gap-1.5 sm:gap-3"
    } ${task.completed ? 'bg-green-400/30 dark:bg-green-500/20 border border-green-500/30' : 'bg-white/20 dark:bg-black/20 border border-white/40 dark:border-white/10'}`}>

      {/* Checkbox */}
      <div
        onClick={togglecomplete}
        className={`flex justify-center items-center h-6 w-6 shrink-0 cursor-pointer rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,2.4)] ${
          task.completed ? "bg-black/5" : ""
        }`}
      >
        <span className="text-black dark:text-white font-bold">
          {task.completed && "✓"}
        </span>
      </div>

      {/* Task Content */}
      <div
        className={`h-full text-black dark:text-white flex gap-2 ${
          isExpanded ? "order-last w-full mt-4 justify-center text-center flex-col items-center" : "flex-1 min-w-0 items-center"
        } ${
          task.completed ? "line-through opacity-60" : ""
        }`}
      >
        {edit ? (
          <textarea
            ref={textareaRef}
            className={`w-full bg-transparent outline-none resize-none overflow-hidden ${isExpanded ? "text-center" : "whitespace-nowrap"}`}
            rows={1}
            value={taskcontent}
            onChange={(e) => setTaskContent(e.target.value)}
          />
        ) : (
          <>
            <span 
              className={`break-words cursor-pointer transition-all ${isExpanded ? "" : "line-clamp-4"}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {task.task}
            </span>
            {/* Date badge */}
            {getDateLabel() && (
              <span className="text-[10px] sm:text-xs bg-white/20 dark:bg-white/10 px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0 text-black/70 dark:text-white/70">
                {getDateLabel()}
              </span>
            )}
          </>
        )}
      </div>

      {/* Important / Star Button */}
      <button
        onClick={() => toggleImportant(task.id)}
        title="Mark as important"
        className="p-1.5 sm:p-2 rounded-full backdrop-blur-md hover:bg-white/20 transition cursor-pointer shrink-0"
      >
        {task.important ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-black/50 dark:text-white/50">
            <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" />
          </svg>
        )}
      </button>

      {/* Date Picker Button */}
      <div className="relative shrink-0" ref={dateRef}>
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          title="Set date"
          className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md hover:bg-white/20 transition cursor-pointer ${task.date ? "text-blue-400" : "text-black/50 dark:text-white/50"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>

        {/* Date dropdown */}
        {showDatePicker && (
          <div className="absolute right-0 top-full mt-1 bg-black/70 dark:bg-black/80 backdrop-blur-xl rounded-xl shadow-xl z-50 overflow-hidden min-w-32 border border-white/10">
            <button
              onClick={() => { setTaskDate(task.id, getTodayString()); setShowDatePicker(false); }}
              className={`w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/15 transition cursor-pointer flex items-center gap-2 ${task.date === getTodayString() ? "bg-white/10" : ""}`}
            >
              <span className="text-base">📅</span> Today
            </button>
            <button
              onClick={() => { setTaskDate(task.id, getTomorrowString()); setShowDatePicker(false); }}
              className={`w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/15 transition cursor-pointer flex items-center gap-2 ${task.date === getTomorrowString() ? "bg-white/10" : ""}`}
            >
              <span className="text-base">🗓️</span> Tomorrow
            </button>
            {task.date && (
              <button
                onClick={() => { setTaskDate(task.id, null); setShowDatePicker(false); }}
                className="w-full text-left px-4 py-2 text-sm text-red-400/90 hover:bg-white/15 transition cursor-pointer flex items-center gap-2 border-t border-white/10"
              >
                <span className="text-base">✕</span> Remove date
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit / Save Button */}
      <button
        onClick={edit ? editTask : () => { setEdit(true); setIsExpanded(true); }}
        className="p-1.5 sm:p-2 rounded-full backdrop-blur-md hover:bg-white/20 transition cursor-pointer text-black dark:text-white shrink-0"
      >
        {edit ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
            <path d="M17 21v-8H7v8" />
            <path d="M7 3v5h8" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        )}
      </button>

      {/* Delete Button (soft delete) */}
      <button
        onClick={() => deleteTask(task.id)}
        className="p-1.5 sm:p-2 rounded-full backdrop-blur-md hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer text-black dark:text-white shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h16" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M6 7l1 14h10l1-14" />
          <path d="M9 7V4h6v3" />
        </svg>
      </button>

    </div>
  );
};

export default NewTasks;