import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddVision from "./pages/AddVision";
import VisionDetail from "./pages/VisionDetail";






export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-vision" element={<AddVision />} />
      <Route path="/vision/:id" element={<VisionDetail />} />
    </Routes>
  );
}
