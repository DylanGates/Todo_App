// Small client-side auth helper using localStorage.
// WARNING: This is for demo/local use only — storing passwords in localStorage
// in plaintext is NOT secure. For production, always use a proper backend and
// hashed passwords over TLS.

export interface User {
  id: string;
  username: string;
  password: string; // plain text here for demo only
  createdAt: string;
}

const STORAGE_KEY = "todo_app_users";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getUsers(): User[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch (e) {
    console.error("Failed to read users from localStorage", e);
    return [];
  }
}

export function saveUsers(users: User[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users to localStorage", e);
  }
}

export function findUser(username: string): User | undefined {
  return getUsers().find((u) => u.username === username);
}

export function registerUser(
  username: string,
  password: string
): { success: boolean; message: string; user?: User } {
  if (!username || !password) return { success: false, message: "username and password required" };
  const existing = findUser(username);
  if (existing) return { success: false, message: "user already exists" };

  const user: User = {
    id: Date.now().toString(),
    username,
    password,
    createdAt: new Date().toISOString(),
  };

  const users = getUsers();
  users.push(user);
  saveUsers(users);

  return { success: true, message: "registered", user };
}

export function authenticate(username: string, password: string): { success: boolean; message: string } {
  const user = findUser(username);
  if (!user) return { success: false, message: "user not found" };
  if (user.password !== password) return { success: false, message: "invalid credentials" };
  return { success: true, message: "ok" };
}

export function clearUsersForDev() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}
