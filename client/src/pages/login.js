import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [usernameRequired, setUsernameRequired] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [wrongUserName, setWrongUserName] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [waitingUser, setWaitingUser] = useState(false);

  useEffect(() => {
    // Fetch users when the component mounts
    fetchUsers();
    fetchWaitingList();
  }, []);
  const fetchUsers = async () => {
    try {
      const response = await fetch("/user");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await response.json();
      setUsers(usersData);
      console.log(usersData);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const fetchWaitingList = async () => {
    try {
      const response = await fetch("/waitinglist");
      const waitingListData = await response.json();
      setWaitingList(waitingListData);
      console.log(waitingListData);
    } catch (error) {
      console.error("Error fetching waiting list:", error);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleFieldFocus = (field) => {
    if (field === "username") {
      setUsernameRequired(false);
      setWrongUserName(false);
    } else {
      setPasswordRequired(false);
      setWrongPassword(false);
    }
  };
  const handleLogin = async () => {
    // Add your login logic here

    if (username === "") {
      setUsernameRequired(true);
      onLogin(false, null, null); // Pass role as null when login fails
      // Remove the login state from local storage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      return;
    }
    if (password === "") {
      setPasswordRequired(true);
      onLogin(false, null, null); // Pass role as null when login fails
      // Remove the login state from local storage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      return;
    }

    try {
      await fetchUsers();
      const user = users.find((user) => user.userName === username);

      if (!user) {
        setWrongUserName(true);
        onLogin(false, null, null); // Pass role as null when login fails
        // Remove the login state from local storage
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        return;
      }

      const isPasswordRight = user.password === password;
      const isUserWaiting = waitingList.some(
        (user) => user.userName === username
      );

      if (isUserWaiting) {
        setWaitingUser(true);
        onLogin(false, null, null); // Pass role as null when login fails
        return;
      } else {
        setWaitingUser(false);
      }

      if (isPasswordRight) {
        setWrongPassword(false);
        console.log("your pass right");

        onLogin(true, user._id, user.role); // Pass the role when login is successful
        // Store the login state in local storage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", user._id);
        localStorage.setItem("userRole", user.role);
      } else {
        setWrongPassword(true);
        onLogin(false, null, null); // Pass role as null when login fails
        // Remove the login state from local storage
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        return;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      onLogin(false, null, null); // Pass role as null when login fails
      // Remove the login state from local storage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      // Handle error fetching users
    }

    console.log("Logging in with:", { username, password });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {waitingUser ? (
        <h1 style={{ textAlign: "center", color: "#1976D2" }}>
          You are in the waiting list !
        </h1>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ textAlign: "center", color: "#1565C0" }}>Login</h1>
          <FormControl required sx={{ width: "300px" }} margin="normal">
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onFocus={(e) => handleFieldFocus("username")}
            />
          </FormControl>

          <p style={{ color: "red", fontSize: "12px" }}>
            {username === "" && usernameRequired
              ? "This field is required"
              : ""}
          </p>

          <p style={{ color: "red", fontSize: "12px" }}>
            {wrongUserName ? "Wrong UserName" : ""}
          </p>

          <FormControl required sx={{ width: "300px" }} margin="normal">
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={(e) => handleFieldFocus("password")}
            />
          </FormControl>
          <p style={{ color: "red", fontSize: "12px" }}>
            {password === "" && passwordRequired
              ? "This field is required"
              : ""}
          </p>

          <p style={{ color: "red", fontSize: "12px" }}>
            {wrongPassword && !wrongUserName ? "Wrong Password" : ""}
          </p>

          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "40px", width: "100px" }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Login;
