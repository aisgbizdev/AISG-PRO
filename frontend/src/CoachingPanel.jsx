import React, { useEffect, useState } from "react";

export default function CoachingPanel({ role }) {
  const [data, setData] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [newData, setNewData] = useState({
    name: "",
    date: "",
    topic: "",
    result: "",
    impact: "",
  });

  const fetchData = async () => {
    const res = await fetch("https://aisg-pro-v2.onrender.com/coaching", {
      credentials: "include",
    });
    const json = await res.json();
    setData(json);
  };

  const handleAdd = async () => {
    await fetch("https://aisg-pro-v2.onrender.com/coaching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newData),
    });
    setFormOpen(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl text-white">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-lg font-bold">🎯 Coaching & Follow-Up Panel</h2>
        {role === "admin" && (
          <button
            className="bg-blue-600 px-3 py-1 rounded text-sm"
            onClick={() => setFormOpen(true)}
          >
            ➕ Add Coaching
          </button>
        )}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Topic</th>
            <th className="text-left py-2">Result</th>
            <th className="text-left py-2">Impact</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-gray-800">
              <td className="py-2">{row.name}</td>
              <td className="py-2">{row.date}</td>
              <td className="py-2">{row.topic}</td>
              <td className="py-2">{row.result}</td>
              <td className="py-2 text-green-400">{row.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {formOpen && role === "admin" && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 text-blue-300">📝 Add Coaching Record</h3>
          {["name", "date", "topic", "result", "impact"].map((key) => (
            <input
              key={key}
              placeholder={key}
              className="block mb-2 p-2 rounded bg-gray-700 w-full"
              value={newData[key]}
              onChange={(e) => setNewData({ ...newData, [key]: e.target.value })}
            />
          ))}
          <button
            className="bg-green-500 px-3 py-1 rounded mt-2"
            onClick={handleAdd}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
