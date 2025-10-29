import React, { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Checking...");
  const [connected, setConnected] = useState(false);
  const [auditData, setAuditData] = useState([]);
  const [toast, setToast] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", score: "", status: "" });

  const BACKEND_URL = "https://aisg-pro-v2.onrender.com";

  // 🧠 Fetch data
  const fetchData = async () => {
    try {
      const ping = await fetch(BACKEND_URL);
      if (!ping.ok) throw new Error("Backend not responding");
      setConnected(true);
      setStatus("✅ Connected");

      const res = await fetch(`${BACKEND_URL}/audit`);
      const json = await res.json();
      setAuditData(json);
    } catch {
      setConnected(false);
      setStatus("❌ Disconnected");
    }
  };

  // 🚨 Toast
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 30000);
    return () => clearInterval(i);
  }, []);

  // 🧩 Submit new audit
  const submitAudit = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        showToast("✅ Audit added successfully!");
        setForm({ name: "", role: "", score: "", status: "" });
        setFormOpen(false);
        fetchData();
      } else showToast("⚠️ Failed to add audit");
    } catch {
      showToast("❌ Error connecting to server");
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-900 text-gray-100">
      <header className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">🧠 AiSG Control Center</h1>
        <span className={connected ? "text-green-400" : "text-red-400"}>
          {status}
        </span>
      </header>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">📋 Audit Records</h2>
        <button
          onClick={() => setFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm"
        >
          ➕ Add Audit
        </button>
      </div>

      <table className="w-full text-sm bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700 text-gray-300">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Score</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {auditData.map((a) => (
            <tr key={a.id} className="border-b border-gray-700">
              <td className="p-2">{a.name}</td>
              <td className="p-2 text-gray-400">{a.role}</td>
              <td className="p-2">{a.score}</td>
              <td className="p-2">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📥 Modal Form */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">➕ Add Audit</h3>

            {["name", "role", "score", "status"].map((f) => (
              <input
                key={f}
                placeholder={f.toUpperCase()}
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="w-full p-2 mb-3 bg-gray-700 rounded-lg text-sm"
              />
            ))}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setFormOpen(false)}
                className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={submitAudit}
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔔 Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg text-sm animate-fade-in-up">
          {toast}
        </div>
      )}
    </div>
  );
}
