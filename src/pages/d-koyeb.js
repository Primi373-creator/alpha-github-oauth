import React, { useState } from "react";
import "../css/d-k.css";
import Copyright from "./copyright";

const Koyeb = () => {
  const [state, setState] = useState({
    koyebName: "",
    databaseUrl: "",
    sessionId: "",
    koyebApiKey: "",
    allFieldsFilled: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    checkAllFieldsFilled();
  };

  const checkAllFieldsFilled = () => {
    if (
      state.koyebName &&
      state.databaseUrl &&
      state.sessionId &&
      state.koyebApiKey
    ) {
      setState((prevState) => ({ ...prevState, allFieldsFilled: true }));
    } else {
      setState((prevState) => ({ ...prevState, allFieldsFilled: false }));
    }
  };

  const handleDeploy = () => {
    if (state.allFieldsFilled) {
      const uri = `
        https://app.koyeb.com/apps/deploy?
        type=git&
        repository=github.com/C-iph3r/alpha-md&
        branch=main&
        name=${state.koyebName}&
        builder=dockerfile&
        env[REACT]=command&
        env[SESSION_ID]=${state.sessionId}&
        env[DATABASE_URL]=${state.databaseUrl}&
        env[BOT_INFO]=alpha-md;C-iph3r;https://i.imgur.com/nXqqjPL.jpg&
        env[PREFIX]=!&
        env[KOYEB_API]=${state.koyebApiKey}&
        env[AUDIO_DATA]=alpha-md;C-iph3r;https://i.imgur.com/nXqqjPL.jpg&
        env[WARNCOUNT]=3&
        env[STATUS_VIEW]=false&
        env[STICKER_DATA]=C-iph3r;alpha-md&
        env[WORKTYPE]=private&
        env[ALPHA_KEY]=alpha-free&
        env[SUDO]=
      `;
      window.location.href = uri;
    } else {
      alert("Please fill in all fields before deploying.");
    }
  };

  return (
    <div className="koyeb-container">
      <input
        type="text"
        placeholder="KOYEB_APP_NAME"
        value={state.koyebName}
        onChange={handleInputChange}
        name="koyebName"
        className="input"
      />
      <input
        type="text"
        placeholder="DATABASE_URL"
        value={state.databaseUrl}
        onChange={handleInputChange}
        name="databaseUrl"
        className="input"
      />
      <input
        type="text"
        placeholder="SESSION_ID"
        value={state.sessionId}
        onChange={handleInputChange}
        name="sessionId"
        className="input"
      />
      <input
        type="text"
        placeholder="KOYEB_API_KEY"
        value={state.koyebApiKey}
        onChange={handleInputChange}
        name="koyebApiKey"
        className="input"
      />
      <button
        className={`button button-deploy ${state.allFieldsFilled ? "" : "disabled"}`}
        onClick={handleDeploy}
        disabled={!state.allFieldsFilled}
      >
        Deploy
      </button>
      <div className="w-full flex justify-center">
        <Copyright />
      </div>
    </div>
  );
};

export default Koyeb;
