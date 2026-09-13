import React, { useState } from "react";
import useDataHook from "../context/Context";
import { auth } from "../firebase";
import { updatePassword } from "firebase/auth";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const avatars = ["👤", "🦊", "🐼", "🐯", "🚀", "🌟"];

const ProfileSettingsModal = ({ activeTab = "account", onClose }) => {
  const {
    userProfile,
    themeMode,
    darkMode,
    lightMode,
    taskSortBy,
    setTaskSortBy,
    task,
    setTask,
  } = useDataHook();
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Form State
  const [nickname, setNickname] = useState(userProfile?.nickname || "");
  const [firstName, setFirstName] = useState(userProfile?.firstName || "");
  const [lastName, setLastName] = useState(userProfile?.lastName || "");
  const [avatar, setAvatar] = useState(userProfile?.avatar || avatars[0]);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Avatar Upload Logic
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        setAvatar(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      if (password && auth.currentUser) {
        await updatePassword(auth.currentUser, password);
      }
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        await axios.put(
          `${API_URL}/api/users/me`,
          {
            nickname,
            avatar,
            firstName,
            lastName,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      setIsError(false);
      setMessage("Profile saved successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setIsError(true);
      setMessage(
        err.code === "auth/requires-recent-login"
          ? "Please sign out and sign back in to change your password."
          : err.message || "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(task, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "tasks_export.json");
    dlAnchorElem.click();
  };

  const handleResetAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset your account? This will delete ALL your tasks permanently!",
      )
    )
      return;
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      for (const t of task) {
        await axios.delete(
          `http://${window.location.hostname}:5001/api/tasks/${t._id || t.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      setTask([]);
      setMessage("Account reset successfully. All tasks deleted.");
    } catch (error) {
      setIsError(true);
      setMessage("Failed to reset account.");
    } finally {
      setLoading(false);
    }
  };

  // Rendering Tabs
  const renderAccountTab = () => (
    <form onSubmit={handleSaveProfile} className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-black dark:text-white mb-2">
        My Account
      </h3>

      <div className="flex gap-4 items-center">
        <label
          className={`shrink-0 h-20 w-20 rounded-full flex items-center justify-center cursor-pointer transition-all ${avatar.startsWith("data:image") || avatar.startsWith("http") ? "border-[3px] border-black dark:border-white shadow-xl bg-cover bg-center" : "bg-black/5 dark:bg-white/5 border border-transparent hover:bg-black/10 dark:hover:bg-white/10 text-4xl"}`}
          style={
            avatar.startsWith("data:image") || avatar.startsWith("http")
              ? { backgroundImage: `url(${avatar})` }
              : {}
          }
        >
          {!(avatar.startsWith("data:image") || avatar.startsWith("http")) &&
            avatar}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </label>
        <div className="flex-1">
          <p className="text-sm font-semibold text-black/60 dark:text-white/60 mb-1">
            Click avatar to upload
          </p>
          <div className="flex gap-2 flex-wrap">
            {avatars.map((av) => (
              <div
                key={av}
                onClick={() => setAvatar(av)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm cursor-pointer transition-all ${avatar === av ? "bg-black/10 dark:bg-white/20 border border-black dark:border-white scale-110" : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"}`}
              >
                {av}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-black/60 dark:text-white/60 block mb-1 uppercase tracking-wider">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-white/40 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-xl px-4 py-2.5 text-base text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm placeholder-black/40 dark:placeholder-white/40"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-1 uppercase tracking-wider">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-white/40 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-xl px-4 py-2.5 text-base text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm placeholder-black/40 dark:placeholder-white/40"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-1 uppercase tracking-wider">
          Nickname (Display Name)
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full bg-white/40 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-xl px-4 py-2.5 text-base text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm placeholder-black/40 dark:placeholder-white/40"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-1 uppercase tracking-wider">
          Update Password
        </label>
        <input
          type="password"
          placeholder="Leave blank to keep current"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/40 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-xl px-4 py-2.5 text-base text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm placeholder-black/40 dark:placeholder-white/40"
        />
      </div>

      <div className="pt-4 border-t border-black/10 dark:border-white/10">
        <p className="text-xs text-black/40 dark:text-white/40 mb-1">
          Account ID:{" "}
          <span className="font-mono">{userProfile?.firebaseUid || "N/A"}</span>
        </p>
        <p className="text-xs text-black/40 dark:text-white/40">
          Joined:{" "}
          {userProfile?.createdAt
            ? new Date(userProfile.createdAt).toLocaleDateString()
            : "Unknown"}
        </p>
      </div>

      <div className="pt-2">
        {message && (
          <div
            className={`text-sm p-3 rounded-xl mb-4 text-center ${isError ? "bg-red-500/10 text-red-600" : "bg-green-500/10 text-green-600"}`}
          >
            {message}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-3 font-bold hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile Changes"}
        </button>
      </div>
    </form>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-black dark:text-white mb-2">
        Preferences & Settings
      </h3>

      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-black/20 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md">
          <div>
            <p className="font-bold text-black dark:text-white">Appearance</p>
            <p className="text-xs text-black/70 dark:text-white/70">
              Toggle dark or light mode
            </p>
          </div>
          <div className="flex bg-white/30 dark:bg-black/40 rounded-full p-1 border border-white/40 dark:border-white/10">
            <button
              onClick={lightMode}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${themeMode === "light" ? "bg-white/80 dark:bg-black/80 shadow-md text-black dark:text-white" : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
              Light
            </button>
            <button
              onClick={darkMode}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${themeMode === "dark" ? "bg-white/80 dark:bg-black/80 shadow-md text-black dark:text-white" : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Dark
            </button>
          </div>
        </div>

        {/* Task Sorting */}
        <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-black/20 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md">
          <div>
            <p className="font-bold text-black dark:text-white">Task Sorting</p>
            <p className="text-xs text-black/70 dark:text-white/70">
              Default order in Main View
            </p>
          </div>
          <select
            value={taskSortBy}
            onChange={(e) => setTaskSortBy(e.target.value)}
            className="bg-white/40 dark:bg-black/40 border border-white/60 dark:border-white/20 rounded-lg px-2 py-1 text-sm text-black dark:text-white outline-none shadow-sm backdrop-blur-md"
          >
            <option value="default" className="text-black bg-white/90">
              Creation Date
            </option>
            <option value="dueDate" className="text-black bg-white/90">
              Due Date
            </option>
            <option value="priority" className="text-black bg-white/90">
              Important First
            </option>
          </select>
        </div>
      </div>

      <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-2">
        Data Management
      </h3>
      <div className="space-y-3">
        <button
          onClick={handleExportData}
          className="w-full flex items-center justify-between p-4 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md transition-colors text-left"
        >
          <div>
            <p className="font-bold text-black dark:text-white">Export Data</p>
            <p className="text-xs text-black/70 dark:text-white/70">
              Download all your tasks as JSON
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-black/60 dark:text-white/60"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
        <button
          onClick={handleResetAccount}
          disabled={loading}
          className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 rounded-2xl border border-red-500/10 transition-colors text-left"
        >
          <div>
            <p className="font-bold text-red-600 dark:text-red-400">
              Reset Account
            </p>
            <p className="text-xs text-red-600/70 dark:text-red-400/70">
              Permanently delete all tasks
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-600 dark:text-red-400"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
      {message && (
        <div
          className={`text-sm p-3 rounded-xl mb-4 text-center ${isError ? "bg-red-500/10 text-red-600" : "bg-green-500/10 text-green-600"}`}
        >
          {message}
        </div>
      )}
    </div>
  );

  const renderAboutTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center pb-6 border-b border-black/10 dark:border-white/10">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-4xl text-white shadow-xl mb-4 transform -rotate-6 hover:rotate-0 transition-transform cursor-default">
          ⚡
        </div>
        <h3 className="text-2xl font-black text-black dark:text-white">
          Task Manager
        </h3>
        <p className="text-sm font-semibold text-black/50 dark:text-white/50">
          Version 1.0.0 (Beta)
        </p>
      </div>

      <div>
        <h4 className="text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-widest mb-3">
          About the Developer
        </h4>
        <div className="bg-white/20 dark:bg-black/20 p-4 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md">
          <p className="text-sm text-black/80 dark:text-white/80 leading-relaxed mb-4">
            Hi! I built this sleek, modern task manager to help you stay
            organized. It features real-time synchronization, Firebase
            authentication, and a beautiful dark mode interface.
          </p>
          <a
            href="#"
            className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Portfolio{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-widest mb-3">
          Connect
        </h4>
        <div className="flex gap-3 flex-wrap">
          <a
            href="https://www.instagram.com/_ayan_pratap_?stkn=MjQ2N3lsbjgyMnpy&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[100px] flex justify-center py-3 bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C]/20 rounded-xl transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href="tel:+916393358683"
            target="_top"
            rel="noopener noreferrer"
            className="flex-1 min-w-[100px] flex justify-center py-3 bg-[#34A853]/10 text-[#34A853] hover:bg-[#34A853]/20 rounded-xl transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.72 11.72 0 003.64.58 1 1 0 011 1v3.5a1 1 0 01-1 1C12.28 22 2 11.72 2 2.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.28.2 2.54.58 3.64a1 1 0 01-.21 1.11l-2.25 2.25z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/ayan-pratap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[100px] flex justify-center py-3 bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 rounded-xl transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href="https://github.com/AyanPrt43"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[100px] flex justify-center py-3 bg-[#181717]/10 text-[#181717] hover:bg-[#181717]/20 rounded-xl transition-colors dark:text-white dark:bg-white/10 dark:hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a
            href="https://wa.me/916393358683"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[100px] flex justify-center py-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 rounded-xl transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Wrapper */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row z-10">
        {/* Close Button (50% out) */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-50 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 shadow-xl border border-red-600/20 rounded-full text-white transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Container */}
        <div className="bg-white/95 dark:bg-black/95 md:bg-white/70 md:dark:bg-black/70 backdrop-blur-[60px] rounded-3xl border border-white/60 dark:border-white/20 shadow-2xl w-full h-full flex flex-col md:flex-row overflow-hidden relative">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0 bg-white/50 dark:bg-black/50 border-b md:border-b-0 md:border-r border-white/40 dark:border-white/10 flex flex-row md:flex-col overflow-x-auto md:overflow-visible custom-scrollbar p-2 md:p-6 gap-2">
            <div className="hidden md:block pb-6 pl-2">
              <h2 className="text-xl font-black text-black dark:text-white drop-shadow-sm">
                Settings
              </h2>
            </div>

            <button
              onClick={() => setCurrentTab("account")}
              className={`shrink-0 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${currentTab === "account" ? "bg-white/80 dark:bg-black/60 text-black dark:text-white shadow-md border border-white/50 dark:border-white/10" : "text-black/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-black/40 hover:text-black dark:hover:text-white"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Account
            </button>

            <button
              onClick={() => setCurrentTab("settings")}
              className={`shrink-0 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${currentTab === "settings" ? "bg-white/80 dark:bg-black/60 text-black dark:text-white shadow-md border border-white/50 dark:border-white/10" : "text-black/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-black/40 hover:text-black dark:hover:text-white"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings
            </button>

            <button
              onClick={() => setCurrentTab("about")}
              className={`shrink-0 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${currentTab === "about" ? "bg-white/80 dark:bg-black/60 text-black dark:text-white shadow-md border border-white/50 dark:border-white/10" : "text-black/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-black/40 hover:text-black dark:hover:text-white"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Developer
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
            {currentTab === "account" && renderAccountTab()}
            {currentTab === "settings" && renderSettingsTab()}
            {currentTab === "about" && renderAboutTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;
