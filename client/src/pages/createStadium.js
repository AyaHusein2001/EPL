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
`;

const StyledForm = styled.form`
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 70rem;
`;

export default function CreateStadium() {
  const [stadiumPosted, setStadiumPosted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    rows: 0,
    rowSeats: 0,
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    city: "",
    rows: "",
    rowSeats: "",
  });

  const handleFieldChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    // Clear validation error when user starts typing
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // If validation fails, don't proceed with form submission
      return;
    }

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

      setStadiumPosted(true);
    } catch (error) {
      console.error("Error creating stadium:", error);
      setStadiumPosted(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {stadiumPosted ? (
          <h1 style={{ textAlign: "center", color: "#1976D2" }}>
            Stadium Created Successfully!
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
                    error={!!formErrors.name}
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
                    />
                    {formErrors.name && (
                      <p style={{ color: "red" }}>{formErrors.name}</p>
                    )}
                  </FormControl>
                </Box>
                <Box>
                  <FormControl
                    required
                    error={!!formErrors.city}
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
                    />
                    {formErrors.city && (
                      <p style={{ color: "red" }}>{formErrors.city}</p>
                    )}
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
                    error={!!formErrors.rows}
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
                    />
                    {formErrors.rows && (
                      <p style={{ color: "red" }}>{formErrors.rows}</p>
                    )}
                  </FormControl>
                </Box>
                <Box>
                  <FormControl
                    required
                    error={!!formErrors.rowSeats}
                    sx={{ width: "500px", marginLeft: "60px" }}
                    variant="standard"
                  >
                    <InputLabel htmlFor="rowSeats">Row Seats</InputLabel>
                    <Input
                      id="rowSeats"
                      value={formData.rowSeats}
                      onChange={(e) =>
                        handleFieldChange("rowSeats", e.target.value)
                      }
                    />
                    {formErrors.rowSeats && (
                      <p style={{ color: "red" }}>{formErrors.rowSeats}</p>
                    )}
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
