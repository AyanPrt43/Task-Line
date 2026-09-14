import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const avatars = ["👤", "🦊", "🐼", "🐯", "🚀", "🌟"];

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState("email"); // 'email' or 'phone' for front side
  const [isFlipped, setIsFlipped] = useState(false); // Controls the 3D flip

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Signup State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword,
      );
      const user = userCredential.user;

      // Send Verification Email
      await sendEmailVerification(user);

      // 2. Update Firebase Profile
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`.trim(),
        photoURL: avatar,
      });

      // 3. Save detailed profile to MongoDB backend
      const token = await user.getIdToken();

      await axios.post(
        `${API_URL}/api/users`,
        {
          firstName,
          lastName,
          nickname,
          avatar,
          email: signupEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier,
      );
      setConfirmationResult(confirmation);
    } catch (err) {
      if (err.code === "auth/billing-not-enabled" || err.message.includes("auth/billing-not-enabled")) {
        setError("Currently mobile authentication is under development. Please sign up with email.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
    } catch (err) {
      setError("Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

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
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setAvatar(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md overflow-y-auto perspective-[1000px]">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* 3D Flip Container */}
        <div
          className={`relative w-full max-w-md transition-transform duration-700 preserve-3d grid ${isFlipped ? "rotate-y-180" : ""}`}
        >
          {/* --- FRONT: LOGIN --- */}
          <div
            className={`[grid-area:1/1] self-center w-full backface-hidden transition-all duration-500 ${isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <div className="bg-white/10 dark:bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-8 relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent -z-10 pointer-events-none"></div>

              <div className="text-center mb-8">
                <div className="inline-flex justify-center items-center h-16 w-16 bg-white/20 dark:bg-white/10 rounded-2xl mb-4 shadow-inner border border-white/20">
                  <svg
                    className="w-8 h-8 text-black dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-black dark:text-white">
                  Welcome Back
                </h2>
                <p className="text-black/60 dark:text-white/60 mt-2">
                  Sign in to sync your tasks
                </p>
              </div>

              {/* Tabs */}
              <div className="flex bg-black/10 dark:bg-black/40 rounded-xl p-1 mb-6">
                <button
                  onClick={() => {
                    setActiveTab("email");
                    setError("");
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "email" ? "bg-white text-black shadow-md" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`}
                >
                  Email
                </button>
                <button
                  onClick={() => {
                    setActiveTab("phone");
                    setError("");
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "phone" ? "bg-white text-black shadow-md" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"}`}
                >
                  Phone
                </button>
              </div>

              {error && !isFlipped && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl mb-6 text-center">
                  {error}
                </div>
              )}

              {/* Email Form */}
              {activeTab === "email" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {showLoginPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-3 font-bold hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Sign In"}
                  </button>
                </form>
              )}

              {/* Phone Form */}
              {activeTab === "phone" && (
                <form
                  onSubmit={confirmationResult ? verifyOTP : requestOTP}
                  className="space-y-4"
                >
                  {!confirmationResult ? (
                    <>
                      <div>
                        <input
                          type="tel"
                          placeholder="Phone Number (e.g. +1234567890)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-3 font-bold hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? "Sending OTP..." : "Send Login Code"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <input
                          type="text"
                          placeholder="6-digit OTP Code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          required
                          className="w-full bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-3 font-bold hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? "Verifying..." : "Verify & Sign In"}
                      </button>
                      <p
                        className="text-center text-sm text-black/60 dark:text-white/60 mt-4 cursor-pointer hover:underline"
                        onClick={() => setConfirmationResult(null)}
                      >
                        Go back
                      </p>
                    </>
                  )}
                </form>
              )}

              <p
                className="text-center text-sm text-black/60 dark:text-white/60 mt-6 cursor-pointer hover:underline"
                onClick={() => {
                  setIsFlipped(true);
                  setError("");
                }}
              >
                Don't have an account? Create one
              </p>
            </div>
          </div>

          {/* --- BACK: SIGNUP --- */}
          <div
            className={`[grid-area:1/1] self-center w-full rotate-y-180 backface-hidden transition-all duration-500 ${!isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <div className="bg-white/10 dark:bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-8 relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent -z-10 pointer-events-none"></div>

              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-black dark:text-white">
                  Create Account
                </h2>
                <p className="text-black/60 dark:text-white/60 mt-2">
                  Setup your profile
                </p>
              </div>

              {error && isFlipped && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl mb-6 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Avatar Selection */}
                <div>
                  <p className="text-xs text-black/60 dark:text-white/60 mb-2 ml-1">
                    Choose an Avatar
                  </p>
                  <div className="flex gap-3 sm:gap-2 justify-center sm:justify-between items-center flex-wrap sm:flex-nowrap mt-2 mb-4">
                    {avatars.map((av) => (
                      <div
                        key={av}
                        onClick={() => setAvatar(av)}
                        className={`shrink-0 sm:shrink h-14 w-14 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-3xl sm:text-2xl cursor-pointer transition-all ${avatar === av ? "bg-white/40 dark:bg-white/20 border-2 border-black dark:border-white scale-110" : "bg-black/5 dark:bg-white/5 border border-transparent hover:bg-black/10 dark:hover:bg-white/10"}`}
                      >
                        {av}
                      </div>
                    ))}

                    {/* Custom Avatar Upload Button */}
                    <label
                      className={`shrink-0 sm:shrink h-14 w-14 sm:h-12 sm:w-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${avatar.startsWith("data:image") ? "border-2 border-black dark:border-white scale-110 bg-cover bg-center" : "bg-black/5 dark:bg-white/5 border border-transparent hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60"}`}
                      style={
                        avatar.startsWith("data:image")
                          ? { backgroundImage: `url(${avatar})` }
                          : {}
                      }
                    >
                      {!avatar.startsWith("data:image") && (
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
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Names */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-1/2 bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-1/2 bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Nickname */}
                <div>
                  <input
                    type="text"
                    placeholder="Nickname (Optional)"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Email & Password */}
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="w-full bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="relative">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="w-full bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl px-4 py-3 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {showSignupPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl py-3 font-bold hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50 mt-2"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
                <p className="text-[11px] leading-tight text-black/50 dark:text-white/50 text-center pt-2">
                  Verification email may go to your spam folder. Please mark it as 'Not Spam'.
                </p>
              </form>

              <p
                className="text-center text-sm text-black/60 dark:text-white/60 mt-5 cursor-pointer hover:underline"
                onClick={() => {
                  setIsFlipped(false);
                  setError("");
                }}
              >
                Already have an account? Sign in
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        id="recaptcha-container"
        className="absolute bottom-0 left-0 pointer-events-none opacity-0"
      ></div>
    </div>
  );
};

export default AuthScreen;
