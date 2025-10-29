import React, { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Checking...");
  const [connected, setConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [auditData, setAuditData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, lastUpdate: "-" });

  const BACKEND_URL = "https://aisg-pro-v2.onrender.com";

  // 🌐 Fungsi fetch data backend
  const fetchData = async () => {
    try {
      const ping = await fetch(BACKEND_URL);
      if (!ping.ok) throw new Error("Backend not responding");
      setConnected(true);
      setStatus("✅ Connected");

      const auditRes = await fetch(`${BACKEND_URL}/audit`);
      const logRes = await fetch(`${BACKEND_URL}/logs`);

      const auditJson = await auditRes.json();
      const logJson = await logRes.json();

      setAuditData(auditJson);
      setLogs(logJson.slice(0, 5));
      setStats({
        total: auditJson.length,
        lastUpdate: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.warn("❌ Connection failed:", err);
      setConnected(false);
      setStatus("❌ Disconnected");
    }
  };

  // 🧠 Ping awal saat load
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30 detik
    return () => clearInterval(interval);
  }, []);

  // 🌗 Dark Mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col p-5 transition-all duration-500">
        <h1 className="text-2xl font-bold mb-8">🧠 AiSG Center</h1>

        <nav className="flex flex-col gap-3 text-sm font-medium">
          <a href="#" className="sidebar-link">📊 Dashboard</a>
          <a href="#" className="sidebar-link">🧩 Audit Panel</a>
          <a href="#" className="sidebar-link">📈 Reports</a>
          <a href="#" className="sidebar-link">👥 User Logs</a>
          <a href="#" className="sidebar-link">⚙️ Settings</a>
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full mt-6 bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-lg transition-all duration-300"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <p className="text-xs text-gray-400 mt-4">
            Powered by <span className="text-blue-400">Newsmaker AiSG</span> ©2025
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 transition-all duration-500 ease-in-out">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold tracking-wide">
            AiSG Control Center
          </h2>
          <span className="text-sm">
            Backend Status:{" "}
            <span className={connected ? "text-green-400" : "text-red-400"}>
              {status}
            </span>
          </span>
        </header>

        <section className="grid grid-cols-3 gap-6">
          {/* Audit Summary */}
          <div className="card">
            <h3 className="font-semibold mb-2">📊 Audit Summary</h3>
            <p className="text-sm mb-1 text-gray-400">
              Total Audits: <span className="font-semibold text-blue-400">{stats.total}</span>
            </p>
            <p className="text-xs text-gray-500">
              Last Update: {stats.lastUpdate}
            </p>
          </div>

          {/* Reports Feed */}
          <div className="card">
            <h3 className="font-semibold mb-3">📈 Reports Feed</h3>
            <ul className="text-sm space-y-1 max-h-40 overflow-auto">
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <li key={i} className="text-gray-400">
                    🕒 {log.time || "–"} → {log.message || JSON.stringify(log)}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No logs found</li>
              )}
            </ul>
          </div>

          {/* Users / Sessions */}
          <div className="card">
            <h3 className="font-semibold mb-2">👥 Active Users</h3>
            <p className="text-sm text-gray-500">
              {Math.floor(Math.random() * 10) + 1} online | 18 total registered
            </p>
            <p className="text-xs text-gray-500 mt-1">Auto-refresh every 30s</p>
          </div>
        </section>
      </main>
    </div>
  );
}
