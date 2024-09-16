import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/auth/*" element={<Auth />} />
      <Route
        path="*"
        element={
          <Navigate to={user ? "/dashboard/home" : "auth/sign-in"} replace />
        }
      />
    </Routes>
  );
}

export default App;
