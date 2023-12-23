// ResponsiveAppBar.js
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

const ResponsiveAppBar = ({ onPageChange, onLogout, isLoggedIn, userRole }) => {
  const handleButtonClick = (page) => {
    onPageChange(page);
  };

  const handleLogout = () => {
    onLogout(); // Notify Home component about logout
    localStorage.removeItem("isLoggedIn");
    handleButtonClick("Login");
  };

  return (
    <AppBar position="fixed">
      <Toolbar disableGutters>
        <Avatar
          sx={{
            width: "80px",
            height: "80px",
            objectFit: "scale-down",
            borderRadius: "0px",
          }}
          alt={`EPL`}
          src="/images/EPL.png"
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "yellow",
            textDecoration: "none",
          }}
        >
          MRS
        </Typography>

        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {userRole==="Admin"?(<></>):(<Button
            onClick={() => handleButtonClick("Matches")}
            sx={{ my: 2, color: "white", display: "block" }}
          >
            Matches
          </Button>)}

          {(isLoggedIn&&userRole==="Admin")?(<Button
            onClick={() => handleButtonClick("Users")}
            sx={{ my: 2, color: "white", display: "block" }}
          >
            users
          </Button>):(<></>)}

          {(isLoggedIn&&userRole==="Admin")?(<Button
            onClick={() => handleButtonClick("WaitingUsers")}
            sx={{ my: 2, color: "white", display: "block" }}
          >
            Waiting Users
          </Button>):(<></>)}

          {isLoggedIn && (userRole === "Manager" || userRole === "Fan") && (
            <>
              {/* Additional buttons for reservations and edit profile */}
              <Button
                onClick={() => handleButtonClick("Reservations")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Reservations
              </Button>
            </>
          )}

          {!isLoggedIn?(<></>):(<Button
            onClick={() => handleButtonClick("EditProfile")}
            sx={{ my: 2, color: "white", display: "block" }}
          >
            Edit Profile
          </Button>)}


          {isLoggedIn && userRole === "Manager" && (
            <Button
              onClick={() => handleButtonClick("CreateMatch")}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Create Match
            </Button>
          )}

          {isLoggedIn && userRole === "Manager" && (
            <Button
              onClick={() => handleButtonClick("CreateStadium")}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Create Stadium
            </Button>
          )}

          {!isLoggedIn ? (
            <>
              <Button
                onClick={() => handleButtonClick("Login")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Login
              </Button>
              <Button
                onClick={() => handleButtonClick("Sign Up")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ResponsiveAppBar;
