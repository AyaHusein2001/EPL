import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/material';
import ReserveDialog from './reserveDialog';
export default function MatchCard({
  country1Name,
  country1Image,
  country2Name,
  country2Image,
  date,
  time,
  matchDetails,
  userId,
  userRole
}) {
    const [open, setOpen] = React.useState(false);
    
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Card sx={{ maxWidth: 345, padding: '15px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-19px' }}>
        <h3 style={{ color: 'cornflowerblue' }}>{date}</h3>
        <h3 style={{ color: 'cornflowerblue' }}>{time}</h3>
      </Box>
      <hr style={{ borderColor: '#CCCCCC' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'cornflowerblue' }}>{country1Name}</h2>
        <Avatar
          sx={{ width: '80px', height: '50px', objectFit: 'scale-down', borderRadius: '0px' }}
          alt={`${country1Name} Flag`}
          src={country1Image}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'cornflowerblue' }}>{country2Name}</h2>
        <Avatar
          sx={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '0px' }}
          alt={`${country2Name} Flag`}
          src={country2Image}
        />
      </Box>
      <CardActions sx={{ justifyContent: 'space-around' }}>
        <Button size="small" onClick={handleClickOpen}>View Match Details</Button>
        <ReserveDialog
        open={open}
        handleClose={handleClose}
        match={matchDetails}
        userId={userId}
        
        />
        {userRole==='Manager'?(<Button size="small">Edit</Button>):<></>}
        
      </CardActions>
    </Card>
  );
}
