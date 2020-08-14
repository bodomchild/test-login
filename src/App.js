import React, { useState, useEffect } from "react";
import Routing from "./routes/Routing";
import LoginSignUp from "./pages/LoginSignUp";
import { AuthContext } from "./utils/context";
import { loggedUser } from "./api/auth";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loadUser, setLoadUser] = useState(false);
  const [refreshCheckLogin, setRefreshCheckLogin] = useState(false);

  useEffect(() => {
    setUser(loggedUser());
    setRefreshCheckLogin(false);
    setLoadUser(true);
  }, [refreshCheckLogin]);

  if (!loadUser) return null;

  return (
    <AuthContext.Provider value={user}>
      {user ? (
        <Routing setRefreshCheckLogin={setRefreshCheckLogin} />
      ) : (
        <LoginSignUp setRefreshCheckLogin={setRefreshCheckLogin} />
      )}
    </AuthContext.Provider>
  );
}

export default App;
