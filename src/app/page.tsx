"use client";

import { useState } from "react";

interface UserData {
  avatar_url: string;
  name: string;
  login: string;
  bio: string;
  html_url: string;
}

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchGitHubProfile = async () => {
    setError(null);
    setUserData(null);
    setRepos([]);

    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) throw new Error("User not found");
      const userData = await userResponse.json();

      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!reposResponse.ok) throw new Error("Repositories not found");
      const reposData = await reposResponse.json();

      setUserData(userData);
      setRepos(reposData);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">GitHub Profile Explorer</h1>

      <div className="flex">
        <input
          type="text"
          placeholder="Enter GitHub username..."
          className="border p-2 rounded-l bg-white text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
          onClick={fetchGitHubProfile}
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {userData && (
        <div className="mt-6 text-center">
          <img src={userData.avatar_url} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
          <h2 className="text-xl font-bold">{userData.name || userData.login}</h2>
          <p>{userData.bio}</p>
          <a href={userData.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-300">
            View Profile
          </a>
        </div>
      )}

      {repos.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <h2 className="text-xl font-bold">Repositories</h2>
          <ul className="mt-4">
            {repos.map((repo) => (
              <li key={repo.id} className="border p-2 rounded mb-2">
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                  {repo.name}
                </a>
                <p>{repo.description || "No description"}</p>
                <p>⭐ {repo.stargazers_count} stars</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
