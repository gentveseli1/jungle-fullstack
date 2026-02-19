"use client";

import { useEffect, useState } from "react";

type User = { id: string; name: string | null; email: string; createdAt: string; };
type ApiError = { error?: string; details?: string; };

async function readJsonSafely(res: Response) {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { error: "Non-JSON response from the server", raw: text } as ApiError;
  }
}

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [savedUser, setSavedUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadUsers() {
    const res = await fetch("/api/users", { cache: "no-store" });
    const data = (await readJsonSafely(res)) as User[] | ApiError | null;
    if (!res.ok) {
      const err = data as ApiError;
      setErrorMsg(err?.error ?? "Failed to load users");
      return;
    }

    setUsers((data as User[] ?? []));
  }

  async function createUser() {
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail) {
      setErrorMsg("Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, name: cleanName || null }),
      });

      const data = (await readJsonSafely(response)) as User | ApiError | null;

      if (!response.ok) {
        console.log("API ERROR:", { status: response.status, data });
        return;
      }

      setSavedUser(data as User);
      setEmail("");
      setName("");
      await loadUsers();
    } catch (error) {
      setErrorMsg("Error in backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <main className="p-8 space-y-6 max-w-md">

        <h1 className="text-2xl font-bold">Welcome to Jungle Fullstack</h1>

        <h1 className="text-2xl font-bold">
          Welcome {name ?? "Student"}!
        </h1>

        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border text-black p-2 rounded mb-4"
        />

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border text-black p-2 rounded mb-4"
        />

        <button
          onClick={createUser}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
        >
          {loading ? "Saving..." : "Create User"}
        </button>

        {errorMsg && (
          <p className="text-red-500">{errorMsg}</p>
        )}

        {savedUser && (
          <div className="border rounded p-4 space-y-1">
            <p>Saved!</p>
            <p>
              <span className="font-medium">Email:</span> {savedUser.email}
            </p>
            <p>
              <span className="font-medium">Name:</span> {" "}
              {savedUser.name ?? "(no name provided)"}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Users</h2>
          <button
            onClick={loadUsers}
            className="text-sm text-blue-500 hover:underline"
          >
            Refresh
          </button>
        </div>

        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="border rounded p-3">
              <div>{user.email}</div>
              <div>{user.name ?? "No name"}</div>
            </li>
          ))}
        </ul>
      </main>

    </>
  );
}
