"use client";

import React, { useState, useEffect } from "react";

interface Note {
  title: string;
  content: string;
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  initialNote?: Note | null;
}

const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNote = null,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialNote) {
        setTitle(initialNote.title || "");
        setContent(initialNote.content || "");
      } else {
        setTitle("");
        setContent("");
      }
    }
  }, [isOpen, initialNote]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave({ title: title.trim(), content: content.trim() });
      setTitle("");
      setContent("");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: isDark ? "#252525" : "#F7F7F7",
          borderColor: isDark ? "#4B5563" : "#D1D5DB",
        }}
        className="border rounded-xl sm:rounded-2xl shadow-xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center items-center mb-3 sm:mb-4">
          <h2
            className="text-xl sm:text-2xl font-bold text-center"
            style={{
              color: isDark ? "#F7F7F7" : "#252525",
            }}
          >
            {initialNote ? "EDIT NOTE" : "NEW NOTE"}
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Input your note title..."
              style={{
                backgroundColor: isDark ? "#1a1a1a" : "#F7F7F7",
                color: isDark ? "#F7F7F7" : "#252525",
                borderColor: isDark ? "#4B5563" : "#D1D5DB",
              }}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
              autoFocus
            />
          </div>

          <div>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add more details..."
              style={{
                backgroundColor: isDark ? "#1a1a1a" : "#F7F7F7",
                color: isDark ? "#F7F7F7" : "#252525",
                borderColor: isDark ? "#4B5563" : "#D1D5DB",
              }}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-vertical h-24 sm:h-32"
            />
          </div>
        </div>

        <div className="flex mt-6 sm:mt-[128px] justify-between gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 w-24 sm:w-[110px] text-xs sm:text-sm font-bold border border-[#6C63FF] text-[#6C63FF] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() && !content.trim()}
            className="px-3 sm:px-4 py-2 w-20 sm:w-[97px] text-xs sm:text-sm font-bold text-white bg-[#6C63FF] hover:bg-[#5a52e6] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
