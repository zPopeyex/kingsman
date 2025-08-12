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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Ejemplo con React Router
<Routes>
  {/* ...otras rutas */}
  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
  <Route path="/terms-of-service" element={<TermsOfService />} />
</Routes>;

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/citas" element={<Booking />} />
        <Route path="/tienda" element={<Shop />} />
        <Route path="/trabajos" element={<Works />} />
        <Route path="/sobre-nosotros" element={<About />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </Layout>
  );
}
