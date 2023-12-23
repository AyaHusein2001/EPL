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

import React, { useState, useEffect } from "react";

import styled from "styled-components";

import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";

var toObject = require("dayjs/plugin/toObject");
dayjs.extend(toObject);

export default function EditMatchDialog({ open, handleClose, match ,fetchMatches }) {
  useEffect(() => {
    
    fetchStadiums();
  }, []);
  const [teams, setTeams] = useState([
    "Al-Ahly",
    "Al-Ettehad-Al-Sakandary",
    "Al-Gounah",
    "Al-Ismaily",
    "Ceramica-Cleopatra",
    "Eastern-Company",
    "El-Masry-Club",
    "El-Mokawloon-El-Arab",
    "El-zamalek",
    "Enppi",
    "Ghazl-El-Mahalla",
    "Misr-Almaqasa",
    "Modern-Future",
    "National-Bank",
    "Pharco",
    "pyramids",
    "Smouha",
    "Tala'ea-El-Gaish",
  ]);

  const { homeTeam, awayTeam, stadiumId, dateTime, mainReferee, linesmen } =
    match;
  const dateTimeObj=new Date(dateTime);
  // Extract date and time from dateTime
  const matchDatee = {
    years: dateTimeObj.getFullYear(),
    months: dateTimeObj.getMonth() , // Months are zero-based
    date: dateTimeObj.getDate(),
    hours: dateTimeObj.getHours(),
    minutes: dateTimeObj.getMinutes(),
    seconds: dateTimeObj.getSeconds(),
    milliseconds: dateTimeObj.getMilliseconds(),
  };
  const [formData, setFormData] = useState({
    homeTeam,
    awayTeam,
    stadiumId,
    mainReferee,
    matchDatee: matchDatee,
    matchTimee: matchDatee,
    lineMan1: linesmen[0] || "", // Use an empty string if linesmen array is empty
    lineMan2: linesmen[1] || "",
  });

  const [stadiums, setStadiums] = useState([]);
  const [matchDate, setMatchDate] = React.useState(dayjs("2022-04-17"));
  const [matchTime, setMatchTime] = React.useState(dayjs("2022-04-17T15:30"));
  const [selectedStadium, setSelectedStadium] = useState("");
  const [matchPosted, setMatchPosted] = useState(false);

  useEffect(() => {
    // Check if formData has stadiumId and initialize selectedStadium
    if (formData && formData.stadiumId) {
      // Assuming stadiums is an array of stadiums
      const selectedStadiumObj = stadiums.find(
        (stadium) => stadium._id === formData.stadiumId
      );

      if (selectedStadiumObj) {
        setSelectedStadium(selectedStadiumObj.name);
      }
    }
  }, []);

  const fetchStadiums = async () => {
    try {
      const response = await fetch("/stadium");
      if (!response.ok) {
        throw new Error("Failed to fetch stadiums");
      }

      const stadiumsData = await response.json();
      setStadiums(stadiumsData);
    } catch (error) {
      console.error("Error fetching stadiums:", error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      // Your form submission logic goes here
      const response = await fetch(`/match/${match._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update match");
      }

      const data = await response.json();
      console.log("Match updated successfully:", data);
      fetchMatches();
      handleClose();
      
      // Set the state to indicate that the match was posted successfully
      
    } catch (error) {
      console.error("Error updating match:", error);
      

      // Handle error here
    }
  };

  const handleFieldChange = async (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleMatchDate = (value) => {
    console.log(value.toObject());
    setMatchDate(value.toObject());
    handleFieldChange("matchDatee", value.toObject());
  };

  const handleMatchTime = (value) => {
    console.log(value.toObject());
    setMatchTime(value.toObject());
    handleFieldChange("matchTimee", value.toObject());
  };

  const handleStadiumChange = (e) => {
    setSelectedStadium(e.target.value);
    const selectedStadium = stadiums.find(
      (stadium) => stadium.name === e.target.value
    );
    console.log("stadddddddd", selectedStadium._id);

    handleFieldChange("stadiumId", selectedStadium._id);
    // Add any additional logic you need when the stadium is selected
  };

  return (
    <React.Fragment>
      <Dialog maxWidth='md' // Adjust the maxWidth as needed
      fullWidth sx={{justifyContent:'center'}} open={open} onClose={handleClose}>
        <DialogTitle>
          Edit Match Details 
        </DialogTitle>
        <DialogContent>
        <Box sx={{ display: "flex" }}>
          <Box>
            <FormControl required variant="standard" sx={{ width: "400px" }}>
              <InputLabel id="home-team"> Home Team</InputLabel>
              <Select
              
                labelId="home-team"
                id="home-team-select"
                value={formData.homeTeam}
                onChange={(e) => handleFieldChange("homeTeam", e.target.value)}
                // onFocus={(e) => handleFieldFocus("role")}
                label="Home Team"
                MenuProps={{
                  style: {
                    maxHeight: "250px", // Set the maximum height for the dropdown menu
                  },
                }}
                defaultValue={formData.homeTeam}
              >
                {teams.map((team, index) => (
                  <MenuItem key={index} value={team}>
                    {team}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormControl
              required
              variant="standard"
              sx={{ width: "400px", marginLeft: "60px" }}
            >
              <InputLabel id="away-team"> Away Team</InputLabel>
              <Select
                labelId="away-team"
                id="away-team-select"
                value={formData.awayTeam}
                onChange={(e) => handleFieldChange("awayTeam", e.target.value)}
                // onFocus={(e) => handleFieldFocus("role")}
                label="away Team"
                MenuProps={{
                  style: {
                    maxHeight: "250px", // Set the maximum height for the dropdown menu
                  },
                }}
                // defaultValue={teams[1]}
              >
                {teams.map((team, index) => (
                  <MenuItem key={index} value={team}>
                    {team}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: "flex", marginTop: "17px" }}>
          <Box>
            <FormControl required variant="standard" sx={{ width: "400px" }}>
              <InputLabel id="stadium">Stadium</InputLabel>
              <Select
                labelId="stadium"
                id="stadium-select"
                value={selectedStadium}
                onChange={handleStadiumChange}
                // defaultValue={stadiums[0].name}
                // onFocus={(e) => handleFieldFocus("role")}
                label="Stadium"
                MenuProps={{
                  style: {
                    maxHeight: "250px", // Set the maximum height for the dropdown menu
                  },
                }}
              >
                {stadiums.map((stadium, index) => (
                  <MenuItem key={index} value={stadium.name}>
                    {stadium.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl
              required
              sx={{ width: "400px", marginLeft: "60px" }}
              variant="standard"
            >
              <InputLabel htmlFor="main-referee">Main Referee</InputLabel>
              <Input
                id="main-referee"
                value={formData.mainReferee}
                onChange={(e) =>
                  handleFieldChange("mainReferee", e.target.value)
                }
                // onFocus={(e) => handleFieldFocus("mainReferee")}
              />
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            marginTop: "40px",
            justifyContent: "space-around",
          }}
        >
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "400px", marginRight: "70px" }}
                label="MatchDate"
                defaultValue={dayjs("2022-04-17")}
                value={matchDate}
                onChange={(newValue) => handleMatchDate(newValue)}
              />
            </LocalizationProvider>
          </Box>

          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                sx={{ width: "400px" }}
                label="Time picker"
                value={matchTime}
                onChange={(newValue) => handleMatchTime(newValue)}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            marginTop: "40px",
            justifyContent: "space-around",
          }}
        >
          <Box>
            <FormControl required sx={{ width: "400px" }} variant="standard">
              <InputLabel htmlFor="line-man-one">Line Man 1</InputLabel>
              <Input
                id="line-man-one"
                value={formData.lineMan1}
                onChange={(e) => handleFieldChange("lineMan1", e.target.value)}
                // onFocus={(e) => handleFieldFocus("mainReferee")}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl
              required
              sx={{ width: "400px", marginLeft: "60px" }}
              variant="standard"
            >
              <InputLabel htmlFor="line-man-two">Line Man 2</InputLabel>
              <Input
                id="line-man-two"
                value={formData.lineMan2}
                onChange={(e) => handleFieldChange("lineMan2", e.target.value)}
                // onFocus={(e) => handleFieldFocus("mainReferee")}
              />
            </FormControl>
          </Box>
        </Box>

        


        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
