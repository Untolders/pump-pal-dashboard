
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {isAuthenticated} from "../lib/googleAuth";

const Index = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting...</p>
    </div>
  );
};

export default Index;
