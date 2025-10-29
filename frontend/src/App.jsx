import React, { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Checking...");
  const [connected, setConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [auditData, setAuditData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, lastUpdate: "-" });
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  const BACKEND_URL = "https://aisg-pro-v2.onrender.com";

  // 🌐 Fetch data
  const fetchData = async () => {
    try {
      const ping = await fetch(BACKEND_URL);
      if (!ping.ok) throw new Error("Backend not responding");
      setConnected(true);
      setStatus("✅ Connected");

      const [auditRes, logRes] = await Promise.all([
        fetch(`${BACKEND_URL}/audit`),
        fetch(`${BACKEND_URL}/logs`),
      ]);
      const [auditJson, logJson] = await Promise.all([
        auditRes.json(),
        logRes.json(),
      ]);

      // 🔔 Detect changes
      if (auditData.length && auditJson.length > auditData.length)
        showToast(`🚨 New audit added! (${auditJson.length - auditData.length})`);
      if (logs.length && logJson.length > logs.length)
        showToast("🆕 New log entry detected!");

      setAuditData(auditJson);
      setLogs(logJson.slice(0, 5));
      setStats({
        total: auditJson.length,
        lastUpdate: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      setConnected(false);
      setStatus("❌ Disconnected");
    }
  };

  // 🔔 Toast
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // 🔁 Refresh every 30s
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // 🔍 Filter logic
  const filteredData = auditData
    .filter((item) => {
      if (filter === "All") return true;
      if (filter === "Passed") return item.status.includes("Passed");
      if (filter === "Coaching") return item.status.includes("Coaching");
      if (filter === "Re-Audit") return item.status.includes("Re-Audit");
      return true;
    })
    .sort((a, b) =>
      sortOrder === "desc" ? b.score - a.score : a.score - b.score
    );

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

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 transition-all duration-500 ease-in-out overflow-y-auto">
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

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-sm"
          >
            <option value="All">All Status</option>
            <option value="Passed">✅ Passed</option>
            <option value="Coaching">⚠️ Coaching</option>
            <option value="Re-Audit">❌ Re-Audit</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-sm"
          >
            <option value="desc">Score: High → Low</option>
            <option value="asc">Score: Low → High</option>
          </select>

          <span className="text-xs text-gray-400">
            Showing {filteredData.length} of {auditData.length} records
          </span>
        </div>

        {/* Audit Table */}
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Score</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((a) => (
                <tr key={a.id} className="border-b border-gray-800">
                  <td className="p-2">{a.name}</td>
                  <td className="p-2 text-gray-400">{a.role}</td>
                  <td className="p-2 font-semibold">{a.score}</td>
                  <td
                    className={`p-2 ${
                      a.status.includes("Passed")
                        ? "text-green-400"
                        : a.status.includes("Coaching")
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg text-sm animate-fade-in-up">
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}
