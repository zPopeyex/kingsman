import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import Shop from "@/pages/Shop";
import Works from "@/pages/Works";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import Profile from "@/pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/citas" element={<Booking />} />
        <Route path="/tienda" element={<Shop />} />
        <Route path="/trabajos" element={<Works />} />
        <Route path="/sobre-nosotros" element={<About />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/perfil" element={<Profile />} />
      </Routes>
    </Layout>
  );
}
