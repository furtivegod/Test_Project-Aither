import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from '../../utils/useAuth';

export default function Admin() {

    const {token} = useAuthStore();
    useEffect(() => {
        if (!token || user?.role !== 'admin') {
          window.location.href = '/dashboard'; // Redirect to dashboard if not admin
        }else{
            alert('You are not authorized to access this page');
        }
      }, [token]);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-xl mb-4">🎉 Admin Page</h1>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
