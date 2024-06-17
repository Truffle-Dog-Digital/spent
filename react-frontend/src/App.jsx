// src/App.jsx
import React, { useEffect, useState } from "react";
import CustomAppBar from "./components/AppBar";
import CSVLoader from "./components/CSVLoader";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  return (
    <div className="App">
      <CustomAppBar user={user} onMenuOpen={handleOpenMenu} />
      {user && (
        <CSVLoader
          menuAnchorEl={menuAnchorEl}
          handleCloseMenu={handleCloseMenu}
        />
      )}
      <div style={{ padding: 20 }}>{/* Your main content goes here */}</div>
    </div>
  );
}

export default App;
