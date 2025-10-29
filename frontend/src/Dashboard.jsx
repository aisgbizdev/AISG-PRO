import React, { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard"; // rename App ke Dashboard.jsx

export default function App() {
  const [role, setRole] = useState(null);

  if (!role) return <Login onLogin={setRole} />;
  return <Dashboard role={role} />;
}
