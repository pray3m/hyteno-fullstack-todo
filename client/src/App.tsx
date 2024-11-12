import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/button";
import ProtectedRoute from "./components/shared/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Button>Login</Button>} />
        <Route path="/register" element={<Button>Register</Button>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Button>Home</Button>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
