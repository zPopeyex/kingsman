// web/apps/src/App.tsx - Actualizado para usar LandingParallax como home
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

// Importa tu LandingParallax en lugar de Home
import LandingParallax from "@/pages/LandingParallax"; // ← Tu componente estrella
import Booking from "@/pages/Booking";
import Shop from "@/pages/Shop";
import Works from "@/pages/Works";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import Profile from "@/pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Ruta principal ahora usa LandingParallax */}
        <Route index element={<LandingParallax />} />

        <Route path="citas" element={<Booking />} />
        <Route path="trabajos" element={<Works />} />
        <Route path="shop" element={<Shop />} />
        <Route path="profile" element={<Profile />} />
        <Route path="sobre-nosotros" element={<About />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
      </Route>
    </Routes>
  );
}
