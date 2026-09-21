import { BrowserRouter, Routes, Route } from "react-router-dom";
import AIChatbot from "./components/AIChatbot";
import Dashboard from "./pages/Dashboard";
import PlantDetails from "./pages/PlantDetails";
import EditPlant from "./pages/EditPlant";
import AddPlant from "./pages/AddPlant";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import JournalHome from "./pages/JournalHome";
import PlantJournal from "./pages/PlantJournal";
import Profile from "./pages/Profile";
import { Navigate } from "react-router-dom";
import CareCalendar from "./pages/CareCalendar";
import AIDoctor from "./pages/AIDoctor";
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token
    ? children
    : <Navigate to="/login" />;
}

function App() {
return (
  <BrowserRouter>

    <Routes>

      <Route path="/" element={<Home />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-doctor"
        element={
          <ProtectedRoute>
            <AIDoctor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CareCalendar />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plant/:id"
        element={
          <ProtectedRoute>
            <PlantDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditPlant />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddPlant />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-plant"
        element={
          <ProtectedRoute>
            <AddPlant />
          </ProtectedRoute>
        }
      />

      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <JournalHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/journal/:id"
        element={
          <ProtectedRoute>
            <PlantJournal />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={<Profile />} />

    </Routes>

    {/* Chatbot goes OUTSIDE Routes */}
    <AIChatbot />

  </BrowserRouter>
);
}

export default App;