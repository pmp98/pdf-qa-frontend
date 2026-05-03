import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./pages/Login";
// import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AuthRedirectRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthRedirectRoute>
            <LandingPage />
          </AuthRedirectRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRedirectRoute>
            <Login />
          </AuthRedirectRoute>
        }
      />
      {/* <Route
        path="/signup"
        element={
          <AuthRedirectRoute>
            <Signup />
          </AuthRedirectRoute>
        }
      /> */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
