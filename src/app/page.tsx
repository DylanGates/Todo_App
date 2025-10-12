"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import SearchBar from "./components/SearchBar";
import FilterButton from "./components/FilterButton";
import DarkModeButton from "./components/DarkModeButton";
import AddButton from "./components/AddButton";
import detectiveImage from "./assets/Detective-check-footprint.png";

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
    // TODO: Implement edit functionality
    console.log("Edit todo:", id);
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="w-full p-4 min-h-screen">
      <div className="max-w-7xl mx-[170px] items-center justify-center">
        <div className="mt-10 mb-4.5 justify-center items-center w-full">
          <h1 className="text-3xl font-bold text-center">TODO LIST</h1>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
          <div className="w-full lg:flex-1 flex items-center">
            <SearchBar placeholder="Search notes" />
          </div>

          <div className="flex items-center gap-3">
            <FilterButton
              onChange={(option) => console.log("Filter:", option)}
            />
            <div className="flex flex-col gap-3">
              <DarkModeButton />
            </div>
          </div>
        </div>

        <div className="mt-[30px] space-y-4">
          {todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <Image
                src={detectiveImage}
                alt="Empty state"
                width={200}
                height={200}
                className="mb-4 opacity-80"
              />
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
                Empty
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="border-b border-[#6C63FF] py-4 px-0 mx-[80px] items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      className="mt-1.5 w-[26px] h-[26px] rounded border-2 border-gray-300 dark:border-gray-600 
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
                    <div className="flex-1">
                      <h3
                        style={{
                          color: todo.completed
                            ? undefined
                            : document.documentElement.classList.contains("dark")
                            ? "#F7F7F7"
                            : "#252525",
                        }}
                        className={`text-lg font-semibold mb-2 transition-all ${
                          todo.completed
                            ? "line-through opacity-60 text-gray-500 dark:text-gray-400"
                            : ""
                        }`}
                      >
                        {todo.title}
                      </h3>
                      {todo.content && (
                        <p className="text-gray-600 dark:text-gray-300">
                          {todo.content}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleEditTodo(todo.id)}
                      className="transition-colors text-[#CDCDCD] hover:text-[#6C63FF]"
                      aria-label="Edit note"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="transition-colors text-[#CDCDCD] hover:text-[#E50000]"
                      aria-label="Delete note"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="fixed bottom-8 right-[180px]">
          <AddButton onAddNote={handleAddTodo} />
        </div>
      </div>
    </div>
  );
}
