import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import MatchCard from '../components/matchCard';

export default function Matches({userId,userRole}) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Fetch matches when the component mounts
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/matches');
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const matchesData = await response.json();
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching matches:', error.message);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {!matches ? (<h1 style={{ textAlign: "center", color: "#1976D2" }}>
            No matches yet , please create some !
          </h1>):(matches.map((match) => (
          <Grid item key={match._id} xs={3}>
            <MatchCard
              country1Name={match.homeTeam}
              country1Image={`/images/${match.homeTeam.toLowerCase()}.png`}
              country2Name={match.awayTeam}
              country2Image={`/images/${match.awayTeam.toLowerCase()}.png`}
              date={new Date(match.dateTime).toLocaleDateString()}
              time={new Date(match.dateTime).toLocaleTimeString()}
              matchDetails={match}
              userId={userId}
              userRole={userRole}
              fetchMatches={fetchMatches}
            />
          </Grid>
        )))}
      </Grid>
    </Box>
  );
}
