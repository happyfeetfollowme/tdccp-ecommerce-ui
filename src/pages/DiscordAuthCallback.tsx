import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DiscordAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); // Redirect to homepage after successful login
    } else {
      navigate("/login-error"); // No token received, redirect to error page
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <p>Processing Discord login...</p>
    </div>
  );
};

export default DiscordAuthCallback;
