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
<p>creeeee</p>
      </div>
    </>
  );
}
