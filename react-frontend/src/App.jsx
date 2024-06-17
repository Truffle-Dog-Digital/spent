import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { auth } from "./firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [processing, setProcessing] = useState(false); // New state to track if a file is being processed

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      handleCloseUserMenu();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleFileChange = async (event) => {
    // Check if a file is already being processed
    if (processing) return;

    const file = event.target.files
      ? event.target.files[0]
      : event.dataTransfer.files[0];
    if (file) {
      setProcessing(true);
      setLoading(true);
      try {
        console.log("Loading file...");
        const text = await file.text();
        const rows = text.split("\n").filter((row) => row.trim() !== "");
        console.log("File loaded successfully");
        const dates = rows.map((row) => {
          const dateStr = row.split(",")[0].trim();
          const [day, month, year] = dateStr.split("/");
          return new Date(`${year}-${month}-${day}`);
        });
        const startDate = new Date(Math.min(...dates));
        const endDate = new Date(Math.max(...dates));
        setSummary({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          rowCount: rows.length,
        });
      } catch (error) {
        console.error("Error reading file: ", error);
      } finally {
        setLoading(false);
        setProcessing(false); // Reset the processing flag
        handleCloseMenu();
      }
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          {user && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleOpenMenu}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Typography variant="h6" component="div">
              Spent
            </Typography>
          </Box>
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title={user.email}>
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName}
                  onClick={handleOpenUserMenu}
                  sx={{ cursor: "pointer" }}
                />
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem>
                  <label
                    htmlFor="upload-csv"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <UploadFileIcon />
                    Load CSV
                    <input
                      id="upload-csv"
                      type="file"
                      accept=".csv"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </label>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" onClick={handleSignIn}>
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          p: 2,
          height: "calc(100vh - 64px)", // Adjust height to exclude AppBar
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed grey",
          borderRadius: "4px",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileChange}
      >
        Drag and drop a CSV file here or use the menu to upload.
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
      {summary && (
        <Dialog open={Boolean(summary)} onClose={() => setSummary(null)}>
          <DialogTitle>CSV Loaded</DialogTitle>
          <DialogContent>
            <Typography>Start Date: {summary.startDate}</Typography>
            <Typography>End Date: {summary.endDate}</Typography>
            <Typography>Number of Rows: {summary.rowCount}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default App;
