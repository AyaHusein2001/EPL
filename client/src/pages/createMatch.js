import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";

var toObject = require("dayjs/plugin/toObject");
dayjs.extend(toObject);
const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  //   height: 100vh; /* Make the container take the full height of the viewport */
`;

// Define a styled component
const StyledForm = styled.form`
  padding: 20px; /* Add some padding for better visual appeal */
  display: flex;
  align-items: center;

  flex-direction: column;
  width: 70rem; /* Set a width to control the form's size */
`;

export default function CreateMatch() {
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
  const [formData, setFormData] = useState({
    homeTeam: "Al-Ahly",
    awayTeam: "Al-Gounah",
    stadiumId: "",
    mainReferee: "",
    matchDatee: {},
    matchTimee: {},
    lineMan1: "",
    lineMan2: "",
  });

  const [stadiums, setStadiums] = useState([]);
  const [matchDate, setMatchDate] = React.useState(dayjs("2022-04-17"));
  const [matchTime, setMatchTime] = React.useState(dayjs("2022-04-17T15:30"));
  const [selectedStadium, setSelectedStadium] = useState("");
  const [matchPosted, setMatchPosted] = useState(false);

  useEffect(() => {
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

    fetchStadiums();
  }, []);

  const handleSubmit = async () => {
    try {
      // Your form submission logic goes here
      const response = await fetch("/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create match");
      }

      const data = await response.json();
      console.log("Match created successfully:", data);

      // Set the state to indicate that the match was posted successfully
      setMatchPosted(true);
    } catch (error) {
      console.error("Error creating match:", error);
      setMatchPosted(false);

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
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {matchPosted ? (
          <h1 style={{ textAlign: "center", color: "#1976D2" }}>
            Match Created Successfully !
          </h1>
        ) : (
          <CenteredContainer>
            <StyledForm>
              <h1 style={{ textAlign: "center", color: "#1565C0" }}>
                Enter Match Details
              </h1>
              <Box sx={{ display: "flex" }}>
                <Box>
                  <FormControl
                    required
                    variant="standard"
                    sx={{ width: "500px" }}
                  >
                    <InputLabel id="home-team">Home Team</InputLabel>
                    <Select
                      labelId="home-team"
                      id="home-team-select"
                      value={formData.homeTeam}
                      onChange={(e) =>
                        handleFieldChange("homeTeam", e.target.value)
                      }
                      // onFocus={(e) => handleFieldFocus("role")}
                      label="Home Team"
                      MenuProps={{
                        style: {
                          maxHeight: "250px", // Set the maximum height for the dropdown menu
                        },
                      }}
                      // defaultValue={teams[0]}
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
                    sx={{ width: "500px", marginLeft: "60px" }}
                  >
                    <InputLabel id="away-team">Away Team</InputLabel>
                    <Select
                      labelId="away-team"
                      id="away-team-select"
                      value={formData.awayTeam}
                      onChange={(e) =>
                        handleFieldChange("awayTeam", e.target.value)
                      }
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
                  <FormControl
                    required
                    variant="standard"
                    sx={{ width: "500px" }}
                  >
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
                    sx={{ width: "500px", marginLeft: "60px" }}
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
                      sx={{ width: "500px", marginRight: "70px" }}
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
                      sx={{ width: "500px" }}
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
                  <FormControl
                    required
                    sx={{ width: "500px" }}
                    variant="standard"
                  >
                    <InputLabel htmlFor="line-man-one">Line Man 1</InputLabel>
                    <Input
                      id="line-man-one"
                      value={formData.lineMan1}
                      onChange={(e) =>
                        handleFieldChange("lineMan1", e.target.value)
                      }
                      // onFocus={(e) => handleFieldFocus("mainReferee")}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl
                    required
                    sx={{ width: "500px", marginLeft: "60px" }}
                    variant="standard"
                  >
                    <InputLabel htmlFor="line-man-two">Line Man 2</InputLabel>
                    <Input
                      id="line-man-two"
                      value={formData.lineMan2}
                      onChange={(e) =>
                        handleFieldChange("lineMan2", e.target.value)
                      }
                      // onFocus={(e) => handleFieldFocus("mainReferee")}
                    />
                  </FormControl>
                </Box>
              </Box>

              <Button
                variant="contained"
                sx={{ marginTop: "40px", width: "100px" }}
                onClick={handleSubmit}
              >
                Create
              </Button>
            </StyledForm>
          </CenteredContainer>
        )}
      </div>
    </>
  );
}
