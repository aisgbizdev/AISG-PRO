import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("🟡 Checking...");
  const [dbTime, setDbTime] = useState(null);
  const backendUrl = "https://aisg-pro-v2.onrender.com";

  useEffect(() => {
    fetch(`${backendUrl}/health`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          setStatus("🟢 Backend Connected");
        } else {
          setStatus("🔴 Error");
        }
      })
      .catch(() => setStatus("🔴 Offline"));

    fetch(`${backendUrl}/audit`)
      .then(res => res.text())
      .then(html => {
        const match = html.match(/Database Time: ([^<]+)/);
        if (match) setDbTime(match[1]);
      })
      .catch(() => setDbTime("Error fetching DB time"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">AISG-PRO Dashboard</h1>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-80 text-center">
        <p className="text-lg mb-2">{status}</p>
        {dbTime && (
          <p className="text-sm text-gray-400">
            DB Time: <span className="font-mono">{dbTime}</span>
          </p>
        )}
      </div>
      <footer className="mt-6 text-gray-500 text-sm">
        Powered by <b>AISG-PRO Backend V2</b>
      </footer>
    </div>
  );
}

export default App;
