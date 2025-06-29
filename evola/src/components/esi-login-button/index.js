import Config from "../../services/config-service";
import { useState, useEffect } from "react";

const SCOPES = ["publicData"];

const generateState = () => {
  return [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
};

export const LoginButton = () => {
  const [hovered, setHovered] = useState(false);

  const handleLogin = () => {
    const state = generateState();
    localStorage.setItem("eve_state", state);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: Config.eve_client_id,
      redirect_uri: Config.eve_callback,
      scope: SCOPES.join(" "),
      state: state,
    });

    window.location.href = `${Config.eve_auth_base}?${params.toString()}`;
  };

  // Preload both images once on mount
  useEffect(() => {
    const preload = (src) => {
      const img = new Image();
      img.src = src;
    };
    preload("/eve-sso-login-black-small.png");
    preload("/eve-sso-login-white-small.png");
  }, []);

  return (
    <img
      src={hovered ? "/eve-sso-login-white-small.png" : "/eve-sso-login-black-small.png"}
      alt="Log in with EVE Online"
      onClick={handleLogin}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer h-6 transition duration-200"
    />
  );
};
