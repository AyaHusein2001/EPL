import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/material";

export default function ReservationCard({
  country1Name,
  country1Image,
  country2Name,
  country2Image,
  date,
  time,
  reservationId,
  ticketId
  
}) {
  

 
  return (
    <Card sx={{ maxWidth: 345, padding: "15px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "-19px",
        }}
      >
        <h3 style={{ color: "cornflowerblue" }}>match ticket id:{ticketId} </h3>
      </Box>
      <hr style={{ borderColor: "#CCCCCC" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Avatar
          sx={{
            width: "80px",
            height: "50px",
            objectFit: "scale-down",
            borderRadius: "0px",
          }}
          alt={`${country1Name} Flag`}
          src={country1Image}
        />
        <Avatar
          sx={{
            width: "80px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "0px",
          }}
          alt={`${country2Name} Flag`}
          src={country2Image}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ color: "cornflowerblue" }}>{country1Name}</h2>
        <h2 style={{ color: "cornflowerblue" }}>VS</h2>
        <h2 style={{ color: "cornflowerblue" }}>{country2Name}</h2>
      </Box>

      <Box sx={{ display: "flex", flexDirection:'column' }}>
        <h3 style={{ color: "cornflowerblue" }}>{date}</h3>
       
        <h3 style={{ color: "cornflowerblue" }}>{time}</h3>
      </Box>
      <CardActions sx={{ justifyContent: "space-around" }}>
        <Button size="small" >
          Cancel Reservation
        </Button>
        
      </CardActions>
    </Card>
  );
}
