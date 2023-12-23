import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ReservationCard from "../components/reservationCard";

export default function Reservations({ userId }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsWithMatches,setReservationsWithMatches]= useState([]);
  useEffect( () => {
    // Fetch matches when the component mounts
     fetchReservations();
     fetchReservationMatches(reservations);
  }, [reservations]);

  const fetchReservations = async () => {
    try {
        console.log('kara',userId)
      const response = await fetch(`/user/${userId}/Reservations`);
      if (!response.ok) {
        throw new Error("Failed to fetch Reservations");
      }

      const reservationsData = await response.json();
      console.log(reservationsData);
      setReservations(reservationsData);
      console.log("zefmta", reservations);

      // Fetch match details for each reservation and append them to the reservations
    } catch (error) {
      console.error("Error fetching Reservations:", error.message);
    }
  };



  const fetchReservationMatches = async (reservationsData) => {
    try {
      const reservationsWithMatchesArray = [];

      for (const reservation of reservationsData) {
        const matchResponse = await fetch(`/matches/${reservation.matchId}`);
        if (!matchResponse.ok) {
          throw new Error('Failed to fetch Match');
        }

        const matchData = await matchResponse.json();
        console.log(matchData);

        // Append match details to the reservation
        const reservationWithMatch = {
          ...reservation,
          match: matchData[0],
        };
        reservationsWithMatchesArray.push(reservationWithMatch);
      }
      console.log(reservationsWithMatchesArray);

      setReservationsWithMatches(reservationsWithMatchesArray);
    } catch (error) {
      console.error('Error fetching match Reservations:', error.message);
    }
  };

  // Run this effect whenever reservations state changes

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {!reservationsWithMatches?(<p>loading</p>):(reservationsWithMatches.map((reservation) => (
          <Grid item key={reservation._id} xs={3}>
            <ReservationCard
              country1Name={reservation.match.homeTeam}
              country1Image={`/images/${reservation.match.homeTeam}.png`}
              country2Name={reservation.match.awayTeam}
              country2Image={`/images/${reservation.match.awayTeam}.png`}
              date={new Date(reservation.match.dateTime).toLocaleDateString()}
              time={new Date(reservation.match.dateTime).toLocaleTimeString()}
              
              reservationId={reservation._id}
              ticketId={reservation.ticketId}
              
            />
          </Grid>
        )))}
      </Grid>
      {/* <p>khahhh</p> */}
    </Box>
  );
}
