import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import FlightSearchPage from "./pages/FlightSearchPage";
import FlightReservationPage from "./pages/FlightReservationPage";
import FlightSuccessPage from "./pages/FlightSuccessPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/flight-search" replace />} />
            <Route path="/flight-search" element={<FlightSearchPage />} />
            <Route
              path="/flight-reservation"
              element={<FlightReservationPage />}
            />
            <Route path="/flight-success" element={<FlightSuccessPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
