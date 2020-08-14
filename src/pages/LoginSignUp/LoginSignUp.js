import React, { useState } from "react";
import Login from "../../components/Login";
import SignUp from "../../components/SignUp";

export default function LoginSignUp(props) {
  const { setRefreshCheckLogin } = props;
  const [mode, setMode] = useState("login");

  return (
    <div>
      {mode === "login" && (
        <Login setRefreshCheckLogin={setRefreshCheckLogin} setMode={setMode} />
      )}
      {mode === "signup" && <SignUp setMode={setMode} />}
    </div>
  );
}
