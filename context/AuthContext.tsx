"use client";

import React, { useState, useEffect, useContext, createContext, ReactNode } from "react";

interface User{
    id: string;
    name: string;
    email: string;
    avatar: string;
}

interface AuthContextType {
    user: User | null;
    signup: (email: string, password: string) => void;
    login: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
    }, []);
  
    const signup = (email: string, password: string) => {
        const newUser: User = { 
            id: Date.now().toString(), 
            email, 
            name: email.split('@')[0], 
            avatar: 'default-avatar.png' 
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
    };

    const login = (email: string, password: string) => {
        const stored = localStorage.getItem("user");
        if (!stored) return alert("No user found. Please sign up first.");
        const existing = JSON.parse(stored);
        if (existing.email === email && existing.password === password) {
            setUser(existing);
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
