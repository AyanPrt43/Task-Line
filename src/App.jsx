import { useEffect, useState } from "react";
import "./App.css";
import { Provider } from "./context/Context.js";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import MainContent from "./components/MainContent.jsx";
import NewTasks from "./components/NewTasks.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("themeMode") || "light",
  );

  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [task, setTask] = useState([]);

  const [filter, setFilter] = useState("All");

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  const [searchQuery, setSearchQuery] = useState("");
  const [taskSortBy, setTaskSortBy] = useState("default");

  const darkMode = () => {
    setThemeMode("dark");
  };

  const lightMode = () => {
    setThemeMode("light");
  };

  const getHeaders = async () => {
    if (!auth.currentUser) return {};

    const token = await auth.currentUser.getIdToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Add Task
  const addTask = async (newTask) => {
    const today = new Date().toISOString().split("T")[0];

    const taskData = {
      important: false,
      date: today,
      deleted: false,
      ...newTask,
    };

    // Optimistic update
    const tempId = Date.now().toString();

    setTask((prev) => [
      {
        id: tempId,
        _id: tempId,
        ...taskData,
      },
      ...prev,
    ]);

    try {
      const res = await axios.post(
        `${API_URL}/api/tasks`,
        taskData,
        await getHeaders(),
      );

      // Replace temporary task with real task from database
      setTask((prev) =>
        prev.map((t) =>
          t.id === tempId
            ? {
                ...res.data,
                id: res.data._id,
              }
            : t,
        ),
      );
    } catch (err) {
      console.error("Failed to add task to DB", err);
    }
  };

  // Update Task
  const updateTask = async (id, updatedTask) => {
    setTask((prev) =>
      prev.map((t) => (t.id === id || t._id === id ? updatedTask : t)),
    );

    try {
      await axios.put(
        `${API_URL}/api/tasks/${updatedTask._id || id}`,
        updatedTask,
        await getHeaders(),
      );
    } catch (err) {
      console.error("Failed to update task in DB", err);
    }
  };

  // Soft Delete Task
  const deleteTask = async (id) => {
    setTask((prev) =>
      prev.map((t) =>
        t.id === id || t._id === id
          ? {
              ...t,
              deleted: true,
            }
          : t,
      ),
    );

    try {
      const t = task.find((t) => t.id === id || t._id === id);

      await axios.put(
        `${API_URL}/api/tasks/${t._id || id}`,
        {
          ...t,
          deleted: true,
        },
        await getHeaders(),
      );
    } catch (err) {
      console.error("Failed to soft-delete task in DB", err);
    }
  };

  // Permanently Delete Task
  const permanentDeleteTask = async (id) => {
    setTask((prev) => prev.filter((t) => t.id !== id && t._id !== id));

    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, await getHeaders());
    } catch (err) {
      console.error("Failed to delete task from DB", err);
    }
  };

  // Restore Task
  const restoreTask = async (id) => {
    setTask((prev) =>
      prev.map((t) =>
        t.id === id || t._id === id
          ? {
              ...t,
              deleted: false,
            }
          : t,
      ),
    );

    try {
      const t = task.find((t) => t.id === id || t._id === id);

      await axios.put(
        `${API_URL}/api/tasks/${t._id || id}`,
        {
          ...t,
          deleted: false,
        },
        await getHeaders(),
      );
    } catch (err) {
      console.error("Failed to restore task", err);
    }
  };

  // Toggle Completed
  const toggleCompleted = async (id) => {
    const t = task.find((t) => t.id === id || t._id === id);

    const updated = {
      ...t,
      completed: !t.completed,
    };

    setTask((prev) =>
      prev.map((t) => (t.id === id || t._id === id ? updated : t)),
    );

    try {
      await axios.put(
        `${API_URL}/api/tasks/${t._id || id}`,
        updated,
        await getHeaders(),
      );
    } catch (err) {
      console.error("Failed to toggle completion", err);
    }
  };

  // Toggle Important
  const toggleImportant = async (id) => {
    const t = task.find((t) => t.id === id || t._id === id);

    const updated = {
      ...t,
      important: !t.important,
    };

    setTask((prev) =>
      prev.map((t) => (t.id === id || t._id === id ? updated : t)),
    );

    try {
      await axios.put(
        `${API_URL}/api/tasks/${t._id || id}`,
        updated,
        await getHeaders(),
      );
    } catch (err) {
      console.error("Failed to toggle importance", err);
    }
  };

  // Set Task Date
  const setTaskDate = async (id, date) => {
    const t = task.find((t) => t.id === id || t._id === id);

    const updated = {
      ...t,
      date,
    };

    setTask((prev) =>
      prev.map((t) => (t.id === id || t._id === id ? updated : t)),
    );

    try {
      await axios.put(
        `${API_URL}/api/tasks/${t._id || id}`,
        updated,
        await getHeaders(),
      );
    } catch (err) {
      console.error("Failed to set task date", err);
    }
  };

  // Get Today's Date
  const getTodayString = () => {
    const today = new Date();

    return today.toISOString().split("T")[0];
  };

  // Get Tomorrow's Date
  const getTomorrowString = () => {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow.toISOString().split("T")[0];
  };

  // Filter Tasks
  const getFilteredTasks = () => {
    const today = getTodayString();
    const tomorrow = getTomorrowString();

    let filtered = task.filter((t) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();

        const taskText = (t.task || "").toLowerCase();

        if (!taskText.includes(query)) {
          return false;
        }
      }

      // Trash view
      if (filter === "Trash") {
        return t.deleted === true;
      }

      // Hide deleted tasks from other views
      if (t.deleted) {
        return false;
      }

      switch (filter) {
        case "All":
          return true;

        case "Today":
          return t.date === today;

        case "Tomorrow":
          return t.date === tomorrow;

        case "Important":
          return t.important === true;

        case "Complete":
          return t.completed === true;

        case "Planned":
          return t.date != null;

        default:
          return true;
      }
    });

    // Sort by due date
    if (taskSortBy === "dueDate") {
      filtered.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;

        return new Date(a.date) - new Date(b.date);
      });
    }

    // Sort by priority
    else if (taskSortBy === "priority") {
      filtered.sort((a, b) => {
        if (a.important === b.important) {
          return 0;
        }

        return a.important ? -1 : 1;
      });
    }

    return filtered;
  };

  // Listen for Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      setAuthLoading(false);

      if (user) {
        try {
          const token = await user.getIdToken();

          // Fetch Profile
          const profileRes = await axios.get(`${API_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserProfile(profileRes.data);

          // Fetch Tasks
          const res = await axios.get(`${API_URL}/api/tasks`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Map MongoDB _id to id
          const tasksFromServer = res.data.map((t) => ({
            ...t,
            id: t._id,
          }));

          setTask(tasksFromServer);
        } catch (err) {
          console.error("Failed to fetch user data from server", err);
        }
      } else {
        // User logged out
        setTask([]);

        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Theme Management
  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
    localStorage.setItem("themeMode", themeMode);

    // Only force theme-color in PWA standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    let metaThemeColor = document.querySelector("meta[name=theme-color]");

    if (isStandalone) {
      if (!metaThemeColor) {
        metaThemeColor = document.createElement("meta");
        metaThemeColor.name = "theme-color";
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.content = themeMode === "dark" ? "#3a3532" : "#c8b3a6";
    } else if (metaThemeColor) {
      // Remove it in browser mode so Safari's native translucent bars show the content underneath
      metaThemeColor.remove();
    }
  }, [themeMode]);

  const filteredTasks = getFilteredTasks();

  const trashCount = task.filter((t) => t.deleted).length;

  return (
    <Provider
      value={{
        themeMode,
        darkMode,
        lightMode,
        task,
        addTask,
        updateTask,
        deleteTask,
        permanentDeleteTask,
        restoreTask,
        toggleCompleted,
        toggleImportant,
        setTaskDate,
        filter,
        setFilter,
        trashCount,
        searchQuery,
        setSearchQuery,
        userProfile,
        setUserProfile,
        taskSortBy,
        setTaskSortBy,
      }}
    >
      <div className="h-full w-full flex flex-col md:flex-row relative overflow-hidden bg-gradient-to-br from-[#c8b3a6] via-[#aabdb5] to-[#749f99] dark:from-[#3a3532] dark:via-[#2f3d37] dark:to-[#223d38]">
        <div
          className={`
            hidden md:block relative inset-y-0 left-0 z-[60] h-full transition-all duration-300 ease-in-out shrink-0
            ${sidebarOpen ? "w-60" : "w-[72px]"}
          `}
        >
          <div className="w-full h-full relative">
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => window.innerWidth < 768 && setSidebarOpen(false)}
            />

            {/* Collapse Toggle Arrow */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex absolute -right-5 top-6 z-50 w-5 h-12 bg-black/30 backdrop-blur-2xl rounded-r-md items-center justify-center text-white/70 hover:text-white transition-all duration-300 cursor-pointer hover:bg-black/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transform transition-transform duration-300 ${
                  sidebarOpen ? "" : "rotate-180"
                }`}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="h-full w-full flex flex-col min-w-0 overflow-hidden">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          {filter !== "Trash" && <MainContent />}

          <div className="flex-1 min-h-0 w-full bg-white/10 dark:bg-black/20 p-3 pb-[100px] sm:p-5 sm:pb-[100px] md:pb-5 overflow-y-auto scrollbar-glass">
            {filter === "Trash" && filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-black/40 dark:text-white/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 7h16" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M6 7l1 14h10l1-14" />
                  <path d="M9 7V4h6v3" />
                </svg>

                <p className="mt-4 text-lg font-medium">Trash is empty</p>
              </div>
            )}

            {filteredTasks.length === 0 && filter !== "Trash" && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-40 h-40 mb-6 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    <path d="M8 10l1.5 1.5L12 9"></path>
                    <path d="M14 10h3"></path>
                    <path d="M8 14l1.5 1.5L12 13"></path>
                    <path d="M14 14h3"></path>
                    <path d="M8 18l1.5 1.5L12 17"></path>
                    <path d="M14 18h3"></path>
                    <path d="M2 12h2"></path>
                    <path d="M4 16l1.5-1.5"></path>
                    <path d="M4 8l1.5 1.5"></path>
                    <path d="M22 12h-2"></path>
                    <path d="M20 16l-1.5-1.5"></path>
                    <path d="M20 8l-1.5 1.5"></path>
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-black/70 dark:text-white/70 mb-2">
                  No tasks found
                </h3>

                <p className="text-base font-medium text-black/50 dark:text-white/50">
                  Add a task to get started!
                </p>
              </div>
            )}

            {filteredTasks.map((t) => (
              <NewTasks
                key={t.id || t._id}
                task={t}
                isTrashView={filter === "Trash"}
              />
            ))}
          </div>
        </div>

        <BottomNav />
      </div>

      {!currentUser && !authLoading && <AuthScreen />}

      {currentUser &&
        !currentUser.emailVerified &&
        currentUser.providerData.some((p) => p.providerId === "password") && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
            <div className="bg-white/10 dark:bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-8 relative overflow-hidden text-center max-w-sm">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                Verify Your Email
              </h2>

              <p className="text-black/60 dark:text-white/60 mb-6">
                We've sent a verification link to your email address. Please
                click it to continue to <b>Ayan's Task Manager</b>.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-3 font-bold mb-3 hover:scale-[1.02] transition-transform active:scale-[0.98]"
              >
                I've Verified It
              </button>

              <button
                onClick={() => {
                  auth.signOut().then(() => {
                    window.location.reload();
                  });
                }}
                className="w-full bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl py-3 font-bold hover:bg-red-500/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
    </Provider>
  );
}

export default App;
