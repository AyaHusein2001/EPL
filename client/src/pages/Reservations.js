import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ReservationCard from "../components/reservationCard";

export default function Reservations({ userId }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsWithMatches,setReservationsWithMatches]= useState([]);
  //11111111111
  // useEffect( () => {
  //   // Fetch matches when the component mounts
  //    fetchReservations();
  //    fetchReservationMatches(reservations);
  // }, [reservations]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservationId) => {
    try {
      const response = await fetch(`/reservations/${reservationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Handle successful deletion
        console.log('Reservation deleted successfully');
        // Update reservations immediately after deletion
        fetchReservations();
      } else {
        // Handle failed deletion
        console.error('Failed to delete reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };
///22222222222
  // const fetchReservations = async () => {
  //   try {
  //       console.log('kara',userId)
  //     const response = await fetch(`/user/${userId}/Reservations`);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch Reservations");
  //     }

  //     const reservationsData = await response.json();
  //     console.log(reservationsData);
  //     setReservations(reservationsData);
  //     console.log("zefmta", reservations);

  //     // Fetch match details for each reservation and append them to the reservations
  //   } catch (error) {
  //     console.error("Error fetching Reservations:", error.message);
  //   }
  // };


///333333333333
  // const fetchReservationMatches = async (reservationsData) => {
  //   try {
  //     const reservationsWithMatchesArray = [];

  //     for (const reservation of reservationsData) {
  //       const matchResponse = await fetch(`/matches/${reservation.matchId}`);
  //       if (!matchResponse.ok) {
  //         throw new Error('Failed to fetch Match');
  //       }

  //       const matchData = await matchResponse.json();
  //       console.log(matchData);

  //       // Append match details to the reservation
  //       const reservationWithMatch = {
  //         ...reservation,
  //         match: matchData[0],
  //       };
  //       reservationsWithMatchesArray.push(reservationWithMatch);
  //     }
  //     console.log(reservationsWithMatchesArray);

  //     setReservationsWithMatches(reservationsWithMatchesArray);
  //   } catch (error) {
  //     console.error('Error fetching match Reservations:', error.message);
  //   }
  // };

  // Run this effect whenever reservations state changes

  const fetchReservations = async () => {
    try {
      const response = await fetch(`/user/${userId}/Reservations`);
      if (!response.ok) {
        throw new Error('Failed to fetch Reservations');
      }

      const reservationsData = await response.json();
      fetchReservationMatches(reservationsData);
    } catch (error) {
      console.error('Error fetching Reservations:', error.message);
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
        const reservationWithMatch = {
          ...reservation,
          match: matchData[0],
        };
        reservationsWithMatchesArray.push(reservationWithMatch);
      }

      setReservationsWithMatches(reservationsWithMatchesArray);
    } catch (error) {
      console.error('Error fetching match Reservations:', error.message);
    }
  };

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
              onDelete={() => handleDeleteReservation(reservation._id)}
              
            />
          </Grid>
        )))}
      </Grid>
      {/* <p>khahhh</p> */}
    </Box>
  );
}
