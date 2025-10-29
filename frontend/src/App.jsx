import React, { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Checking...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetch("https://aisg-pro-v2.onrender.com")
      .then((res) => {
        if (res.ok) {
          setStatus("✅ Connected");
          setConnected(true);
        } else {
          setStatus("⚠️ Backend reachable but returned error");
        }
      })
      .catch(() => setStatus("❌ Cannot connect to backend"));
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-6">AiSG Center</h1>
        <nav className="flex flex-col gap-3 text-sm">
          <a href="#" className="hover:text-blue-400">Dashboard</a>
          <a href="#" className="hover:text-blue-400">Audit Panel</a>
          <a href="#" className="hover:text-blue-400">Reports</a>
          <a href="#" className="hover:text-blue-400">User Logs</a>
          <a href="#" className="hover:text-blue-400">Settings</a>
        </nav>
        <div className="mt-auto text-xs text-gray-400">
          Powered by Newsmaker.aiSG ©2025
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 transition">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">🧠 AiSG Control Center</h2>
          <span className="text-sm">
            Backend Status:{" "}
            <span className={connected ? "text-green-400" : "text-red-400"}>
              {status}
            </span>
          </span>
        </header>

        <section className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Audit Summary</h3>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Reports</h3>
            <p className="text-sm text-gray-500">Auto-sync module ready.</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold mb-2">User Activity</h3>
            <p className="text-sm text-gray-500">Monitoring in progress...</p>
          </div>
        </section>
      </main>
    </div>
  );
}
