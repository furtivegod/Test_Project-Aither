import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useAuthStore from '../../utils/useAuth';

export default function PrivateRoute({ children }) {
  const { token } = useAuthStore();
  console.log(token);
  try {
    jwtDecode(token);
    return children;
  } catch {
    return <Navigate to="/" replace />;
  }
}
