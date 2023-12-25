import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const WaitingUsers = () => {
  const [waitingUsers, setWaitingUsers] = useState([]);

  useEffect(() => {
    // Fetch waiting list users when the component mounts
    fetch("/waitinglist")
      .then((response) => response.json())
      .then((data) => setWaitingUsers(data))
      .catch((error) =>
        console.error("Error fetching waiting list users:", error)
      );
  }, []);

  const handleApprove = (userId) => {
    // Find the user with the specified userId in the waitingUsers state
    const userToApprove = waitingUsers.find((user) => user._id === userId);

    if (!userToApprove) {
      console.error("User not found in the waiting list");
      return;
    }

    // Make a request to the server to handle the approval action
    fetch("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToApprove), // Include the user data in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User approved:", data);

        // If approval is successful, delete the user from the waiting list
        fetch(`/waitinglist/${userId}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((deleteData) => {
            console.log("User deleted from waiting list:", deleteData);

            // After approval and deletion, update the local state to reflect the changes
            setWaitingUsers(waitingUsers.filter((user) => user._id !== userId));
          })
          .catch((deleteError) =>
            console.error("Error deleting user from waiting list:", deleteError)
          );
      })
      .catch((error) => console.error("Error approving user:", error));
  };

  const handleReject = (userId) => {
    // Make a request to the server to delete the user from the waiting list
    fetch(`/waitinglist/${userId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((deleteData) => {
        console.log("User deleted from waiting list:", deleteData);

        // After rejection, update the local state to reflect the changes
        setWaitingUsers(waitingUsers.filter((user) => user._id !== userId));
      })
      .catch((deleteError) =>
        console.error("Error deleting user from waiting list:", deleteError)
      );
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {!waitingUsers ? (
        <h1 style={{ textAlign: "center", color: "#1976D2" }}>
          No users in the waiting list !
        </h1>
      ) : (
        waitingUsers.map((user, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ width: "100%" }}>
              <ListItemAvatar>
                <Avatar alt={user.firstName} />
              </ListItemAvatar>
              <ListItemText
                primary={user.userName}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {`${user.firstName} ${user.lastName}`}
                    </Typography>
                    {` — ${user.city}, ${user.address}`}
                  </React.Fragment>
                }
              />
              <Button
                onClick={() => handleApprove(user._id)}
                // variant="contained"
                color="primary"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleReject(user._id)}
                // variant="contained"
                color="error"
              >
                Reject
              </Button>
            </ListItem>
            {index < waitingUsers.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default WaitingUsers;
