import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Login } from "./Login";
import { Home } from "./Home";

import Session from "./modules/Section";

export function App() {
  const [session, setSession] = useState({});
  return (
    <Session setSession={setSession}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home session={session} />} />
      </Routes>
    </Session>
  );
}
