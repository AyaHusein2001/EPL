import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ResponsiveAppBar from '../components/navBar';
import Login from '../pages/login';
import Signup from '../pages/signup';
import Matches from './matches';
import Reservations from './Reservations';
import EditProfile from './editProfile';
// import Tota from './editee';
import CreateMatch from './createMatch';
import CreateStadium from './createStadium';
import WaitingUsers from './waitingList';
import UsersList from './usersList';

const Home = () => {
  const userIdHome = localStorage.getItem('userId');
  const [currentPage, setCurrentPage] = useState('Matches');
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleLogin = (loggedIn, userId,role) => {
    setIsLoggedIn(loggedIn);
    // setUserId(userId);
    // setUserRole(role);
    console.log(userId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    // Add any additional logout logic if needed
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // Fetch user role when the component mounts
    
    if (isLoggedIn) {
      setUserId(localStorage.getItem('userId'));
      setUserRole(localStorage.getItem('userRole'));

      handlePageChange('Matches');
    }
  }, [isLoggedIn]);

  return (
    <>
      <ResponsiveAppBar
        onPageChange={handlePageChange}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
      />
      <Box sx={{ marginTop: '80px', textAlign: 'center' }}>
        {/* Conditionally render components based on the selected page and user's role */}
        
         
            {currentPage === 'Login' && <Login onLogin={handleLogin} />}
            {currentPage === 'Sign Up' && <Signup />}        
            {currentPage === 'Matches' && <Matches userId ={userId} userRole={userRole} />}
            {currentPage === 'Reservations' && <Reservations userId ={userId}  />}
            {currentPage === 'EditProfile' && <EditProfile userId ={userId}  />}
            {currentPage === 'CreateMatch' && <CreateMatch   />}
            {currentPage === 'CreateStadium' && <CreateStadium   />}
            {currentPage === 'WaitingUsers' && <WaitingUsers   />}
            {currentPage === 'Users' && <UsersList   />}
      </Box>
    </>
  );
};

export default Home;
