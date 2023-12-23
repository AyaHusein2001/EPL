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

export default function CreateStadium() {
  const [stadiumPosted, setStadiumPosted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    rows: 0,
    rowSeats: 0,
  });
  const handleFieldChange = async (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      // Your form submission logic goes here
      const response = await fetch("/stadium", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create stadium");
      }

      const data = await response.json();
      console.log("stadium created successfully:", data);

      // Set the state to indicate that the match was posted successfully
      setStadiumPosted(true);
    } catch (error) {
      console.error("Error creating match:", error);
      setStadiumPosted(false);

      // Handle error here
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // alignItems: "center",
          // height: "100vh",
        }}
      >
        {stadiumPosted ? (
          <h1 style={{ textAlign: "center", color: "#1976D2" }}>
            Stadium Created Successfully !
          </h1>
        ) : (
          <CenteredContainer>
            <StyledForm>
              <h1 style={{ textAlign: "center", color: "#1565C0" }}>
                Enter Stadium Details
              </h1>

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
                    <InputLabel htmlFor="name">Stadium Name</InputLabel>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
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
                    <InputLabel htmlFor="city">Stadium City</InputLabel>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleFieldChange("city", e.target.value)
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
                  <FormControl
                    required
                    sx={{ width: "500px" }}
                    variant="standard"
                  >
                    <InputLabel htmlFor="rows">
                      Number of rows in stadium
                    </InputLabel>
                    <Input
                      id="rows"
                      value={formData.rows}
                      onChange={(e) =>
                        handleFieldChange("rows", e.target.value)
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
                    <InputLabel htmlFor="line-man-two">rowseats</InputLabel>
                    <Input
                      id="line-man-two"
                      value={formData.rowSeats}
                      onChange={(e) =>
                        handleFieldChange("rowSeats", e.target.value)
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
