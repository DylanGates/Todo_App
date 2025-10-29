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
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      const { password, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
    }
  }, []);

  const signup = (email: string, password: string) => {
    const usersData = localStorage.getItem("users");
    const users: User[] = usersData ? JSON.parse(usersData) : [];

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      alert("User with this email already exists. Please login.");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split("@")[0],
      password,
      avatar: "default-avatar.png",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    const { password: _pwd, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
  };

  const login = (email: string, password: string) => {
    const usersData = localStorage.getItem("users");
    if (!usersData) {
      alert("No users found. Please sign up first.");
      return;
    }

    const users: User[] = JSON.parse(usersData);
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));

      const { password: _pwd, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
    } else {
      alert("Invalid email or password.");
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
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
