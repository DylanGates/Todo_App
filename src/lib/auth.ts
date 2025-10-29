// Small client-side auth helper using localStorage.
// WARNING: This is for demo/local use only — storing passwords in localStorage
// in plaintext is NOT secure. For production, always use a proper backend and
// hashed passwords over TLS.

export interface User {
  id: string;
  username: string;
  // password stored as SHA-256 hex string; legacy plain-text values are supported
  password: string;
  createdAt: string;
}

const STORAGE_KEY = "todo_app_users";

function isBrowser(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
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
  const q = username.toLowerCase();
  return getUsers().find((u) => u.username.toLowerCase() === q);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

async function hashPassword(password: string): Promise<string> {
  if (!isBrowser() || !window.crypto || !window.crypto.subtle) {
    // fallback: simple (not secure) hash using btoa for environments without SubtleCrypto
    return Promise.resolve(btoa(password));
  }
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hash = await window.crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(hash));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function looksHashed(s: string) {
  return /^[a-f0-9]{64}$/i.test(s) || /^[A-Za-z0-9+/=]+$/.test(s); // allow btoa fallback
}

export async function registerUser(
  username: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User }> {
  if (!username || !password)
    return { success: false, message: "username and password required" };
  const existing = findUser(username);
  if (existing) return { success: false, message: "user already exists" };

  const hashed = await hashPassword(password);

  const user: User = {
    id: Date.now().toString(),
    username,
    password: hashed,
    createdAt: new Date().toISOString(),
  };

  const users = getUsers();
  users.push(user);
  saveUsers(users);

  return { success: true, message: "registered", user };
}

export async function authenticate(
  username: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const user = findUser(username);
  if (!user) return { success: false, message: "user not found" };

  // if stored password looks hashed, compare hashed values
  if (looksHashed(user.password)) {
    const hashed = await hashPassword(password);
    if (hashed === user.password) return { success: true, message: "ok" };
    return { success: false, message: "invalid credentials" };
  }

  // legacy plain-text stored password: compare directly and upgrade to hashed
  if (user.password === password) {
    try {
      const newHash = await hashPassword(password);
      const users = getUsers().map((u) => (u.id === user.id ? { ...u, password: newHash } : u));
      saveUsers(users);
    } catch (e) {
      console.warn("Failed to upgrade plaintext password to hashed", e);
    }
    return { success: true, message: "ok" };
  }

  return { success: false, message: "invalid credentials" };
}

export function clearUsersForDev() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Seed users from a JSON file in the `public/` folder (e.g. /seed-users.json).
 * This is handy for development: drop a `public/seed-users.json` file with
 * { "users": [{ "username": "alice", "password": "pass" }] }
 * On first run (when no users in localStorage) this will register those users
 * (passwords get hashed by registerUser).
 */
export async function seedUsersFromPublic(url = "/seed-users.json") {
  if (!isBrowser()) return;
  try {
    const existing = getUsers();
    if (existing.length > 0) return; // don't overwrite existing users

    const res = await fetch(url);
    if (!res.ok) return;
    const payload = await res.json();
    const list: Array<{ username: string; password: string }> = payload?.users || [];
    if (!Array.isArray(list) || list.length === 0) return;

    await Promise.all(
      list.map(async (u) => {
        try {
          await registerUser(u.username, u.password);
        } catch (e) {
          // ignore individual failures
          console.warn("failed to seed user", u.username, e);
        }
      })
    );
  } catch (e) {
    console.warn("seedUsersFromPublic failed", e);
  }
}
