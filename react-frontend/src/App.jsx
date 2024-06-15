import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function App() {
  const user = null; // Replace with actual user authentication check later

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Spent
          </Typography>
          {!user && <Button color="inherit">Sign In</Button>}
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <h1>Welcome to My App</h1>
        <p>Edit src/App.jsx and save to test HMR</p>
      </Box>
    </div>
  );
}

export default App;
