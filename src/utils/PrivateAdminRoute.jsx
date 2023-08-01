import { Navigate } from "react-router-dom";
import { useContext} from "react";
import AuthContext from "../context/AuthContext";

const PrivateAdminRoute = ({ children, ...rest }) => {

  const { user } = useContext(AuthContext);
  const userAdmin = "admin";

  return user.type !== userAdmin ? (
    <Navigate to="/dashboard/home" replace />
  ) : (
    children
  );
};

export default PrivateAdminRoute;
