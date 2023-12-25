import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch waiting list users when the component mounts
    fetch('/user')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching  users:', error));
  }, []);

  
  const handleRemove = (userId) => {
    // Make a request to the server to delete the user from the waiting list
    fetch(`/user/${userId}/delete`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((deleteData) => {
        console.log('User deleted :', deleteData);

        // After rejection, update the local state to reflect the changes
        setUsers(users.filter((user) => user._id !== userId));
      })
      .catch((deleteError) =>
        console.error('Error deleting user :', deleteError)
      );
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {!users?(<h1 style={{ textAlign: "center", color: "#1976D2" }}>
            No users yet !
          </h1>):(users.map((user, index) => (
        <React.Fragment key={index}>
          <ListItem  alignItems="flex-start" sx={{ width: '100%' }}>
            <ListItemAvatar>
              <Avatar alt={user.firstName}  />
            </ListItemAvatar>
            <ListItemText
              primary={user.userName}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
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
              onClick={() => handleRemove(user._id)}
              // variant="contained"
              color='error'
            >
              Remove
            </Button>
          </ListItem>
          {index < users.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      )))}
    </List>
  );
};

export default UsersList;
