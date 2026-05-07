import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

import {
  LayoutDashboard,
  BarChart3,
  Trophy,
  MessageSquare,
  Home,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Users,
  Settings
} from "lucide-react";


import NotificationBell from "./NotificationBell";

// Utility to resolve avatar URL
const getAvatarUrl = (profile_picture) => {
  if (!profile_picture) return "";
  if (profile_picture.startsWith("/uploads/")) {
    const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
    const origin = apiUrl.replace(/\/api\/?$/, "");
    return `${origin}${profile_picture}`;
  }
  return profile_picture;
};

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "neon-blue");
  const menuRef = useRef();

  const themeOptions = [
    { value: "neon-pink", label: "Pink", className: "bg-pink-600 hover:bg-pink-700" },
    { value: "neon-blue", label: "Blue", className: "bg-cyan-500 hover:bg-cyan-400 text-slate-950" },
    { value: "neon-purple", label: "Purple", className: "bg-purple-600 hover:bg-purple-700" },
  ];

  const sidebarItems = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { to: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
    { to: "/feedback", label: "Feedback", icon: <MessageSquare size={18} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const topNavItems = [
    { to: "/", label: "Home", icon: <Home size={28} /> },
    { to: "/learn", label: "Learn", icon: <BookOpen size={28} /> },
    { to: "/quiz", label: "Quiz", icon: <HelpCircle size={28} /> },
    { to: "/detect-phishing", label: "Detect", icon: <ShieldCheck size={28} /> },
    { to: "/community", label: "Community", icon: <Users size={28} /> },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setSettingsDropdownOpen(false);
      }
    };

    if (menuOpen || settingsDropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => window.removeEventListener("click", handleClickOutside);
  }, [menuOpen, settingsDropdownOpen]);

  useEffect(() => {
    if (!user) {
      setMenuOpen(false);
      setSettingsDropdownOpen(false);
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const userLevel = user?.level || user?.awareness_level || user?.badge_level || "Basic Awareness";

    return (
      <header className="fixed top-0 left-0 w-full h-14 z-40 backdrop-blur-lg bg-[#020617]/40 border-b border-cyan-500/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          {/* LOGO */}
          <h1 className="font-bold text-white">
            <span className="text-cyan-400">Cyber</span>Aware
          </h1>

          {/* CENTER NAV (DESKTOP) */}
          <nav className="hidden md:flex gap-14">
            {topNavItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex flex-col items-center justify-center px-2 transition ${
                    isActive
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-cyan-300"
                  }`
                }
              >
                {icon}
                <span
                  className="text-xs mt-1 h-4 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100"
                  style={{ minHeight: '1rem' }}
                >
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4 relative" ref={menuRef}>
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-[#111827] animate-pulse" aria-label="Loading user" />
            ) : user ? (
              <>
                <NotificationBell />
                {/* PROFILE BUTTON */}
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center overflow-hidden"
                  aria-label="Open profile menu"
                >
                  {user.profile_picture ? (
                    <img
                      src={getAvatarUrl(user.profile_picture)}
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg text-cyan-300 font-bold">
                      {userInitial}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-cyan-300 transition"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-3 py-1.5 text-sm rounded-md bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
                >
                  Sign up
                </NavLink>
              </div>
            )}

            {/* DROPDOWN MENU */}
            {user && menuOpen && (
              <div className="absolute right-0 top-14 w-56 bg-[#0f172a] border border-cyan-500/10 rounded-lg shadow-xl z-50">
                {/* USER INFO (clickable for profile) */}
                <div
                  className="p-4 border-b border-slate-800 cursor-pointer group"
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    {user?.profile_picture ? (
                      <img
                        src={getAvatarUrl(user.profile_picture)}
                        alt="User profile"
                        className="w-10 h-10 rounded-full object-cover border border-cyan-900 group-hover:border-cyan-400 transition"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-full bg-cyan-900 flex items-center justify-center text-lg text-cyan-300 font-bold">
                        {userInitial}
                      </span>
                    )}
                    <div>
                      <p className="text-white font-semibold group-hover:text-cyan-400 transition">
                        {user.name}
                      </p>
                      <p className="text-xs text-cyan-400">
                        Level: {userLevel}
                      </p>
                    </div>
                  </div>
                </div>
                {/* ALL NAVIGATION LINKS (Mobile: all, Desktop: sidebar only) */}
                <div className="flex flex-col py-2">
                  {/* Show topNavItems only on mobile, sidebarItems always */}
                  {topNavItems.map(({ to, label, icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 text-sm transition md:hidden ${
                          isActive
                            ? "text-cyan-400 bg-cyan-900/20"
                            : "text-slate-300 hover:text-cyan-300 hover:bg-cyan-900/10"
                        }`
                      }
                    >
                      {icon}
                      {label}
                    </NavLink>
                  ))}
                  {sidebarItems.map(({ to, label, icon }) =>
                    to === "/settings" ? (
                      <div key={to} className="relative">
                        <button
                          onClick={() => setSettingsDropdownOpen(v => !v)}
                          className={`flex items-center gap-3 px-4 py-2 text-sm transition w-full text-left ${
                            settingsDropdownOpen
                              ? "text-cyan-400 bg-cyan-900/20"
                              : "text-slate-300 hover:text-cyan-300 hover:bg-cyan-900/10"
                          }`}
                        >
                          {icon}
                          {label}
                          <svg className={`ml-auto w-4 h-4 transition-transform ${settingsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {settingsDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1 w-52 bg-[#111827] border border-cyan-900 rounded-lg shadow-xl z-50 p-3 flex flex-col gap-2">
                            <div>
                              <span className="block text-xs text-slate-400 mb-1">Theme</span>
                              <div className="flex gap-2">
                                {themeOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    className={`px-2 py-1 rounded text-white transition text-xs border ${
                                      option.className
                                    } ${
                                      theme === option.value
                                        ? "border-white"
                                        : "border-transparent"
                                    }`}
                                    onClick={() => setTheme(option.value)}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setMenuOpen(false);
                                setSettingsDropdownOpen(false);
                                navigate("/help-support");
                              }}
                              className="w-full text-left px-2 py-1 rounded text-cyan-300 hover:bg-cyan-900/30 text-xs mt-2"
                            >
                              Help & Support
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 text-sm transition ${
                            isActive
                              ? "text-cyan-400 bg-cyan-900/20"
                              : "text-slate-300 hover:text-cyan-300 hover:bg-cyan-900/10"
                          }`
                        }
                      >
                        {icon}
                        {label}
                      </NavLink>
                    )
                  )}
                </div>
                {/* LOGOUT */}
                <div className="p-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      setSettingsDropdownOpen(false);
                      navigate("/login");
                    }}
                    className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
  );
};

export default Header;
