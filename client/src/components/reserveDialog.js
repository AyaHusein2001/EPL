import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MdOutlineEventSeat } from "react-icons/md";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export default function ReserveDialog({ open, handleClose, match, userId,userRole }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [stadium, setStadium] = React.useState(null);
  const [selectedSeat, setSelectedSeat] = React.useState(null);
  const [creditCard, setCreditCard] = React.useState("");
  const [pinNumber, setPinNumber] = React.useState("");
  const [error, setError] = React.useState(null);
  const [sameTime, setSameTime] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [reservations, setReservations] = React.useState([]);

  const [reservationsWithMatches, setReservationsWithMatches] = React.useState(
    []
  );

  React.useEffect(() => {
    fetchStadium();
    fetchReservations();
    fetchUserReservations();
    // Fetch reservations when the component first mounts
  }, []);
  // Function to fetch stadium details
  const fetchStadium = async () => {
    try {
      const response = await fetch(`/stadium/${match.stadiumId}`);
      const data = await response.json();
      setStadium(data);
    } catch (error) {
      console.error("Error fetching stadium:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch(`/matches/${match._id}/reservations`);
      const reservationsData = await response.json();

      setReservations(reservationsData);
      console.log("koky", reservationsData);
    } catch (error) {
      console.error("Error fetching match reservations:", error);
    }
  };
  const fetchUserReservations = async () => {
    try {
      const response = await fetch(`/user/${userId}/Reservations`);
      if (!response.ok) {
        throw new Error("Failed to fetch Reservations");
      }

      const reservationsData = await response.json();
      fetchReservationMatches(reservationsData);
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
          throw new Error("Failed to fetch Match");
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
      console.error("Error fetching match Reservations:", error.message);
    }
  };
  // Only fetch reservations when match._id changes

  const isSeatReserved = (row, seat) => {
    // Check if the seat is reserved in the stored reservations state
    const ik = reservations.some(
      (reservation) => reservation.row == row && reservation.seat == seat
    );
    console.log(ik);
    return ik;
  };

  const handleSeatClick = (row, seat) => {
    if (!isSeatReserved(row, seat)) {
      setSelectedSeat({ row, seat });
    }
  };

  const handleFieldFocus = () => {
    setError(false);
  };

  const handleSameTime = () => {
    const isSameTime = reservationsWithMatches.some((reservation) => {
      console.log("first match time", reservation.match.dateTime);
      console.log("second match time", match.dateTime);

      return (
        reservation.match.dateTime == match.dateTime &&
        reservation.match._id !== match._id
      );
    });
    console.log("ghareebbbb", isSameTime);

    return isSameTime;
  };

  const handleReserve = async () => {
    const isSameTime = handleSameTime();
    if (!isSameTime && selectedSeat && creditCard && pinNumber) {
      try {
        console.log("ghareebbbb geadn", sameTime);

        const response = await fetch(`/matches/${match._id}/reservations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            row: selectedSeat.row,
            seat: selectedSeat.seat,
            customerId: userId,
            ticketId: selectedSeat.row * 10 + selectedSeat.seat,
            matchId: match._id,
          }),
        });

        if (response.ok) {
          // Handle successful reservation
          console.log("Reservation successful");
          // Set success message
          setSuccessMessage("Reservation successful !");
          fetchReservations(); // update screen

          // You may want to update the local match data or fetch the updated match data here
          // handleClose(); // Close the dialog after successful reservation
        } else {
          // Handle failed reservation
          console.error("Failed to reserve seat");
          // Clear success message if any
          if (isSameTime) {
            setSameTime(true);
            setSuccessMessage(null);
          } else {
            setSuccessMessage(null);
          }
        }
      } catch (error) {
        console.error("Error making reservation request:", error);
        // Clear success message if any
        setSuccessMessage(null);
      }
    } else {

      if (isSameTime) {
        setSameTime(true);
        setError("");
        setSuccessMessage(null);
      } else{
      // Display an error or prevent reservation
      setError("Please fill in all required fields.");
      // Clear success message if any
      setSuccessMessage(null);
      }
    }
  };

  const renderEventSeats = () => {
    if (stadium) {
      const { rows, rowSeats } = stadium;
      const seats = [];

      for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= rowSeats; j++) {
          const isReserved = isSeatReserved(i, j);
          const isSelected =
            selectedSeat && selectedSeat.row === i && selectedSeat.seat === j;

          seats.push(
            <MdOutlineEventSeat
              key={`${i}-${j}`}
              color={isReserved ? "grey" : "red"}
              size={40}
              style={{
                backgroundColor: isSelected ? "#CCCCCC" : "transparent",
                cursor: "pointer",
              }}
              onClick={() => handleSeatClick(i, j)}
            />
          );
        }
      }

      return seats;
    }

    return null;
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {match.homeTeam} Vs {match.awayTeam}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            <p style={{ color: "black", textAlign: "center" }}>
              {" "}
              <strong> Stadium:</strong> {stadium ? stadium.name : "Loading..."}{" "}
            </p>
            <p style={{ color: "black", textAlign: "center" }}>
              {" "}
              <strong> Date:</strong>{" "}
              {new Date(match.dateTime).toLocaleDateString()}
            </p>
            <p style={{ color: "black", textAlign: "center" }}>
              {" "}
              <strong> Time:</strong>{" "}
              {new Date(match.dateTime).toLocaleTimeString()}
            </p>
            <p style={{ color: "black", textAlign: "center" }}>
              {" "}
              <strong> Main Referee:</strong> {match.mainReferee}
            </p>
            <p style={{ color: "black", textAlign: "center" }}>
              {" "}
              <strong> Line Man 1:</strong> {match.linesmen[0]}
            </p>
            <p style={{ color: "black", textAlign: "center" }}>
              {" "}
              <strong> Line Man 2:</strong> {match.linesmen[1]}
            </p>

            {isLoggedIn && renderEventSeats()}
          </DialogContentText>
          {isLoggedIn &&(userRole === "Fan") && (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl
                  error={error ? true : false}
                  required
                  sx={{ width: "300px" }}
                  margin="normal"
                  onFocus={(e) => handleFieldFocus()}
                >
                  <InputLabel htmlFor="credit-card">Credit Card</InputLabel>
                  <Input
                    id="credit-card"
                    type="text"
                    value={creditCard}
                    onChange={(e) => setCreditCard(e.target.value)}
                  />
                </FormControl>

                <FormControl
                  required
                  sx={{ width: "300px", marginLeft: "60px" }}
                  margin="normal"
                  error={error ? true : false}
                  onFocus={(e) => handleFieldFocus()}
                >
                  <InputLabel htmlFor="pin-number">Pin Number</InputLabel>
                  <Input
                    id="pin-number"
                    type="password"
                    value={pinNumber}
                    onChange={(e) => setPinNumber(e.target.value)}
                  />
                </FormControl>
              </Box>
              {error && (
                <Typography variant="caption" color="error">
                  {error}
                </Typography>
              )}

              {sameTime && (
                <Typography variant="caption" color="error">
                  You have another match at this time , cancel this reservation
                  first if you won't attend !
                </Typography>
              )}

              {successMessage && (
                <Typography style={{ color: "green" }}>
                  {successMessage}
                </Typography>
              )}
            </>
          )}
        </DialogContent>

        {isLoggedIn && (userRole === "Fan") &&(
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleReserve}>Reserve</Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
