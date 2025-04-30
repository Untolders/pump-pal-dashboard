// src/components/logout/LogoutButton.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
 //logout 
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
