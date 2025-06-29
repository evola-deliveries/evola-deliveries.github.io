import Config from "../../services/config-service";
import { useEffect } from "react";
import { useHistory  } from "react-router-dom";

export const CallbackPage = () => {
  const history = useHistory();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const storedState = localStorage.getItem("eve_state");

    if (!code || !state || state !== storedState) {
      alert("Invalid OAuth callback");
      return;
    }

    fetch(`${Config.evola_api_root_url}/oauth/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("character", JSON.stringify(data.character));
        history.push("/");
      });
  }, [history]);

  return <p>Logging you in via EVE Online, please wait~ 🌌</p>;
};

export default CallbackPage;