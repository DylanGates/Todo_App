"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/signin")}
          className="px-4 py-2 text-[#6C63FF] border border-[#6C63FF] rounded-lg hover:bg-[#6C63FF] hover:text-white transition-all"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="px-4 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5a54d3] transition-all"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center text-white font-semibold">
          {user.name ? user.name[0].toUpperCase() : <User size={18} />}
        </div>
        <span
          style={{
            fontWeight: 500,
            color: document.documentElement.classList.contains("dark")
              ? "#E5E7EB" 
              : "#000000",
          }}
        >
          {user.name}
        </span>


        <ChevronDown
          size={16}
          className={`transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <LogOut size={18} className="text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
