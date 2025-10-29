"use client";

import React, { useState } from "react";
import { registerUser } from "../../lib/auth";

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = registerUser(username.trim(), password);
    setMessage(res.message);
    if (res.success) {
      setUsername("");
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Choose a username"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Choose a password"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="px-3 py-2 bg-[#6C63FF] text-white rounded hover:bg-[#5a52e6]"
        >
          Register
        </button>
        {message && <div className="text-sm text-gray-700">{message}</div>}
      </div>
    </form>
  );
};

export default RegisterForm;
