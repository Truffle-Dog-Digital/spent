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
import {
  handleSignIn,
  handleSignOut,
  handleOpenUserMenu,
  handleCloseUserMenu,
  handleOpenMenu,
  handleCloseMenu,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
} from "./eventHandlers";

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log("Auth state changed, user:", user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          {user && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={(e) => handleOpenMenu(e, setMenuAnchorEl)}
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
                  onClick={(e) => handleOpenUserMenu(e, setAnchorEl)}
                  sx={{ cursor: "pointer" }}
                />
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleCloseUserMenu(setAnchorEl)}
              >
                <MenuItem
                  onClick={() =>
                    handleSignOut(auth, () => handleCloseUserMenu(setAnchorEl))
                  }
                >
                  Sign Out
                </MenuItem>
              </Menu>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => handleCloseMenu(setMenuAnchorEl)}
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
                      onChange={(e) =>
                        handleFileChange(e, user, setLoading, setSummary, () =>
                          handleCloseMenu(setMenuAnchorEl)
                        )
                      }
                    />
                  </label>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" onClick={() => handleSignIn(auth)}>
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
          backgroundColor: dragging ? "rgba(0, 123, 255, 0.1)" : "transparent", // Change background color when dragging
        }}
        onDragOver={(e) => handleDragOver(e, setDragging)}
        onDragLeave={() => handleDragLeave(setDragging)}
        onDrop={(e) =>
          handleDrop(e, setDragging, (e) =>
            handleFileChange(e, user, setLoading, setSummary, () =>
              handleCloseMenu(setMenuAnchorEl)
            )
          )
        }
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
