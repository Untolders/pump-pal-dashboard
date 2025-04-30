
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

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
      className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2 transition-colors"
    >
      <LogOut size={18} />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
};

export default LogoutButton;
