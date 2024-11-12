import { Route, Routes } from "react-router-dom";
import { Button } from "./components/ui/button";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Button>Register</Button>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Button>Home</Button>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
