"use client";

import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  signup: (email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const userData = JSON.parse(stored);
      // Don't expose password in the user state
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
    }
  }, []);

  const signup = (email: string, password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split("@")[0],
      password,
      avatar: "default-avatar.png",
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
  };

  const login = (email: string, password: string) => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert("No user found. Please sign up first.");
      return;
    }
    const existing = JSON.parse(stored);
    if (existing.email === email && existing.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pwd, ...userWithoutPassword } = existing;
      setUser(userWithoutPassword);
    } else {
      alert("Invalid credentials.");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
