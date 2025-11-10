"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import SearchBar from "./components/SearchBar";
import FilterButton from "./components/FilterButton";
import DarkModeButton from "./components/DarkModeButton";
import AddButton from "./components/AddButton";
import NoteModal from "./components/NoteModal";
import UserProfile from "./components/UserProfile";
import detectiveImage from "./assets/Detective-check-footprint.png";
import { useEffect } from "react";
import { seedUsersFromPublic } from "../lib/auth";

interface Todo {
  id: number;
  title: string;
  content: string;
  completed: boolean;
  createdAt: Date;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [noteCounter, setNoteCounter] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // seed demo users into localStorage on first client load (dev convenience)
    seedUsersFromPublic();
  }, []);

  const handleAddTodo = (note: { title: string; content: string }) => {
    const newTodo: Todo = {
      id: Date.now(),
      title: note.title || `Note #${noteCounter}`,
      content: note.content,
      completed: false,
      createdAt: new Date(),
    };

    setTodos([...todos, newTodo]);
    setNoteCounter(noteCounter + 1);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleUpdateTodo = (note: { title: string; content: string }) => {
    if (!editingTodo) return;

    setTodos(
      todos.map((t) =>
        t.id === editingTodo.id
          ? { ...t, title: note.title || t.title, content: note.content }
          : t
      )
    );

    setEditingTodo(null);
    setIsEditModalOpen(false);
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="w-full p-2 sm:p-4 min-h-screen">
      <div className="mx-4 sm:mx-[16px] md:mx-[170px] items-center justify-center">
        <div className="flex justify-between items-center mt-2 sm:mt-4 mb-6 sm:mb-10 w-full mx-2">
          <div className="flex-1"></div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center whitespace-nowrap flex-1">TODO LIST</h1>
          <div className="flex-1 flex justify-end">
            <UserProfile />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 w-full">
          <div className="w-full lg:flex-1 flex items-center">
            <SearchBar
              placeholder="Search notes"
              onSearch={(t) => setSearchTerm(t)}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-end">
            <FilterButton
              onChange={(option) => console.log("Filter:", option)}
            />
            <div className="flex flex-col gap-3">
              <DarkModeButton />
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-[30px] space-y-4">
          {todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <Image
                src={detectiveImage}
                alt="Empty state"
                width={200}
                height={200}
                className="mb-4 opacity-80 w-32 h-32 sm:w-48 sm:h-48 md:w-[200px] md:h-[200px]"
              />
              <p className="text-lg sm:text-xl font-medium text-gray-600 dark:text-gray-400">
                Empty
              </p>
            </div>
          ) : (
            todos
              .filter((t) => {
                if (!searchTerm) return true;
                const q = searchTerm.toLowerCase();
                return (
                  t.title.toLowerCase().includes(q) ||
                  (t.content || "").toLowerCase().includes(q)
                );
              })
              .map((todo) => (
                <div
                  key={todo.id}
                  className="border-b border-[#6C63FF] py-3 sm:py-4 px-0 mx-0 sm:mx-8 md:mx-[80px] items-center"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-1 flex items-start gap-2 sm:gap-3">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo.id)}
                        className="mt-1.5 w-5 h-5 sm:w-[26px] sm:h-[26px] rounded border-2 border-gray-300 dark:border-gray-600 
                               appearance-none cursor-pointer transition-colors
                               checked:bg-[#6C63FF] checked:border-[#6C63FF] 
                               dark:checked:bg-[#6C63FF] dark:checked:border-[#6C63FF]
                               relative
                               checked:after:content-['✓'] checked:after:absolute 
                               checked:after:left-1/2 checked:after:top-1/2 
                               checked:after:-translate-x-1/2 checked:after:-translate-y-1/2
                               checked:after:text-white checked:after:text-xs checked:after:font-bold"
                        aria-label="Toggle completion"
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          style={{
                            color: todo.completed
                              ? undefined
                              : document.documentElement.classList.contains(
                                  "dark"
                                )
                              ? "#F7F7F7"
                              : "#252525",
                          }}
                          className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 transition-all break-words ${
                            todo.completed
                              ? "line-through opacity-60 text-gray-500 dark:text-gray-400"
                              : ""
                          }`}
                        >
                          {/** highlight matched substring in title */}
                          {searchTerm
                            ? (() => {
                                const q = searchTerm;
                                const parts = todo.title.split(
                                  new RegExp(`(${q})`, "i")
                                );
                                return parts.map((part, i) =>
                                  part.toLowerCase() === q.toLowerCase() ? (
                                    <span
                                      key={i}
                                      className="bg-yellow-200 dark:bg-yellow-600 px-0"
                                    >
                                      {part}
                                    </span>
                                  ) : (
                                    <span key={i}>{part}</span>
                                  )
                                );
                              })()
                            : todo.title}
                        </h3>
                        {todo.content && (
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 break-words">
                            {todo.content}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1.5 sm:gap-2 pt-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditTodo(todo.id)}
                        className="transition-colors text-[#CDCDCD] hover:text-[#6C63FF]"
                        aria-label="Edit note"
                      >
                        <Pencil size={18} className="sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="transition-colors text-[#CDCDCD] hover:text-[#E50000]"
                        aria-label="Delete note"
                      >
                        <Trash2 size={18} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 md:right-[180px]">
          <AddButton onAddNote={handleAddTodo} />
        </div>
        {/* Edit modal (used for editing existing notes) */}
        <NoteModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTodo(null);
          }}
          onSave={handleUpdateTodo}
          initialNote={
            editingTodo
              ? { title: editingTodo.title, content: editingTodo.content }
              : null
          }
        />
      </div>
    </div>
  );
}
