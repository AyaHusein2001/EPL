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

export default function Signup() {
  /*
  pass>=8
  email is valid
  required fields
  unique username 
  */
  const [birthDate, setBirthDate] = React.useState(dayjs("2022-04-17"));
  const [validPass, setvalidPass] = React.useState(0);
  const [passwordTouched, setPasswordTouched] = React.useState(false);
  const [userNameTouched, setUserNameTouched] = React.useState(false);
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [uniqueUserName, setuniqueUserName] = React.useState(false);
  const [validEmail, setvalidEmail] = React.useState(false);

  const [waitingListStatus, setWaitingListStatus] = useState(null);
  const [signedUp, setSignedUp] = useState(false);
  const [waitingUser, setWaitingUser] = useState(false);
  // Your form component
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    city: "",
    address: "",
    email: "",
    role: "",
    birthDatee: {},
  });

  const [formRequired, setFormRequired] = useState({
    userName: 0,
    password: 0,
    firstName: 0,
    lastName: 0,
    gender: 0,
    city: 0,
    email: 0,
    role: 0,
  });

  const [users, setUsers] = useState([]);
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    // Fetch users when the component mounts
    fetchUsers();
    fetchWaitingList();
  }, []);

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9/._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log(emailRegex.test(email));
    setvalidEmail(emailRegex.test(email));
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/user");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await response.json();
      setUsers(usersData);
      console.log(usersData);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const fetchWaitingList = async () => {
    try {
      const response = await fetch("/waitinglist");
      const waitingListData = await response.json();
      setWaitingList(waitingListData);
      console.log(waitingListData);
    } catch (error) {
      console.error("Error fetching waiting list:", error);
    }
  };

  const isFormDataValid = () => {
    // Exclude "address" from validation
    const formDataWithoutAddress = { ...formData };
    delete formDataWithoutAddress.address;
    const notNullVars = !Object.values(formDataWithoutAddress).some(
      (value) => value === ""
    );
    isValidEmail(formData["email"]);
    return notNullVars && validPass && uniqueUserName && validEmail;
  };

  // Function to handle form field changes
  const handleFieldChange = async (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    if (field === "password") {
      setPasswordTouched(true);
      if (value.length >= 8) {
        setvalidPass(() => 1);
      } else {
        setvalidPass(() => 0);
      }
    }

    if (field === "email") {
      setEmailTouched(true);
      isValidEmail(formData["email"]);
      const isUserWaiting = waitingList.some((user) => user.email === value);
        if(isUserWaiting)
        {
          setWaitingUser(true);
        }
        else{
         setWaitingUser(false);
        }
    }
    if (field === "userName") {
      setUserNameTouched(true);
      try {
        await fetchUsers();
        await fetchWaitingList();
        const isUserNameUnique = !(
          users.some((user) => user.userName === value) ||
          waitingList.some((user) => user.userName === value)
        );

        

        if (isUserNameUnique) {
          setuniqueUserName(true);
        } else {
          setuniqueUserName(false);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error fetching users
      }
    }
  };

  const checkRequiredFields = () => {
    const updatedFormRequired = {};

    for (const field in formData) {
      const value = formData[field];

      if (typeof value === "string") {
        updatedFormRequired[field] =
          typeof value === "string" && value.trim() === "" ? 1 : 0;
      } else {
        // If it's an object, you might want to implement specific logic for it
        // For now, let's consider it's always valid
        updatedFormRequired[field] = 0;
      }
    }

    setFormRequired(updatedFormRequired);
  };
  // Function to handle form field changes
  const handleFieldFocus = (field) => {
    setFormRequired((prevData) => ({
      ...prevData,
      [field]: 0,
    }));
  };

  const handleBirthDate = (value) => {
    setBirthDate(value);
    handleFieldChange("birthDatee", value.toObject());
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Access formData to get all the form data
    checkRequiredFields();
    const validate=isFormDataValid();
    if (validate&!waitingUser) {
      // Perform form submission logic
      console.log("Form data is valid");
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setSignedUp(true);
          // You can handle the response from the server here
        })
        .catch((error) => {
          console.error("Error:", error);
          setSignedUp(false);
          // Handle errors here
        });
    }
    else if(validate&&waitingUser){
      setSignedUp(true);
    }
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {signedUp ? (
        <h1 style={{ textAlign: 'center', color:'#1976D2' }}>You are in the waiting list !</h1>
      ) : (
        <CenteredContainer>
          <StyledForm>
            <h1 style={{ textAlign: "center", color: "#1565C0" }}>Sign up</h1>

            <Box sx={{ display: "flex" }}>
              <Box>
                <FormControl
                  required
                  sx={{ width: "500px" }}
                  variant="standard"
                >
                  <InputLabel htmlFor="user-name">UserName</InputLabel>
                  <Input
                    id="user-name"
                    value={formData.userName}
                    onChange={(e) =>
                      handleFieldChange("userName", e.target.value)
                    }
                    onFocus={(e) => handleFieldFocus("userName")}
                  />
                </FormControl>
                <p style={{ color: "red", fontSize: "12px" }}>
                  {!uniqueUserName && userNameTouched
                    ? "UserName must be unique,please try another one"
                    : ""}
                </p>

                <p style={{ color: "red", fontSize: "12px" }}>
                  {formRequired["userName"] ? "This field is required" : ""}
                </p>
              </Box>

              <Box>
                <FormControl
                  required
                  sx={{ width: "500px", marginLeft: "60px" }}
                  variant="standard"
                >
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleFieldChange("password", e.target.value)
                    }
                    onFocus={(e) => handleFieldFocus("password")}
                  />
                </FormControl>

                <p
                  style={{ color: "red", marginLeft: "60px", fontSize: "12px" }}
                >
                  {formRequired["password"] ? "This field is required" : ""}
                </p>

                <p
                  style={{ color: "red", marginLeft: "60px", fontSize: "12px" }}
                >
                  {!validPass && !formRequired["password"] && passwordTouched
                    ? "weak password"
                    : ""}
                </p>
              </Box>
            </Box>

            <Box sx={{ display: "flex", marginTop: "17px" }}>
              <Box>
                <FormControl
                  required
                  sx={{ width: "500px" }}
                  variant="standard"
                >
                  <InputLabel htmlFor="fname">firstName</InputLabel>
                  <Input
                    id="fname"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleFieldChange("firstName", e.target.value)
                    }
                    onFocus={(e) => handleFieldFocus("firstName")}
                  />
                </FormControl>
                <p style={{ color: "red", fontSize: "12px" }}>
                  {formRequired["firstName"] ? "This field is required" : ""}
                </p>
              </Box>
              <Box>
                <FormControl
                  required
                  sx={{ width: "500px", marginLeft: "60px" }}
                  variant="standard"
                >
                  <InputLabel htmlFor="lname">lastName</InputLabel>
                  <Input
                    id="lname"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleFieldChange("lastName", e.target.value)
                    }
                    onFocus={(e) => handleFieldFocus("lastName")}
                  />
                </FormControl>
                <p
                  style={{ color: "red", marginLeft: "60px", fontSize: "12px" }}
                >
                  {formRequired["lastName"] ? "This field is required" : ""}
                </p>
              </Box>
            </Box>

            <Box sx={{ display: "flex", marginTop: "17px" }}>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <p style={{ color: "#747474" }}>Birth date *</p>

                  <DatePicker
                    sx={{ width: "500px" }}
                    defaultValue={dayjs("2022-04-17")}
                    value={birthDate}
                    onChange={(newValue) => handleBirthDate(newValue)}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <FormControl
                  required
                  variant="standard"
                  sx={{ width: "500px", marginLeft: "60px", marginTop: "57px" }}
                >
                  <InputLabel id="gender">Gender</InputLabel>
                  <Select
                    labelId="gender"
                    id="gender-select"
                    value={formData.gender}
                    onChange={(e) =>
                      handleFieldChange("gender", e.target.value)
                    }
                    onFocus={(e) => handleFieldFocus("gender")}
                    label="Gender"
                  >
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                  </Select>
                </FormControl>
                <p
                  style={{ color: "red", marginLeft: "60px", fontSize: "12px" }}
                >
                  {formRequired["gender"] ? "This field is required" : ""}
                </p>
              </Box>
            </Box>

            <Box sx={{ display: "flex", marginTop: "17px" }}>
              <Box>
                <FormControl
                  required
                  sx={{ width: "500px" }}
                  variant="standard"
                >
                  <InputLabel htmlFor="city">City</InputLabel>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    onFocus={(e) => handleFieldFocus("city")}
                  />
                </FormControl>
                <p style={{ color: "red", fontSize: "12px" }}>
                  {formRequired["city"] ? "This field is required" : ""}
                </p>
              </Box>
              <Box>
                <FormControl
                  sx={{ width: "500px", marginLeft: "60px" }}
                  variant="standard"
                >
                  <InputLabel htmlFor="address">Address</InputLabel>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleFieldChange("address", e.target.value)
                    }
                  />
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: "flex", marginTop: "17px" }}>
              <Box>
                <FormControl
                  required
                  sx={{ width: "500px" }}
                  variant="standard"
                >
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <Input
                    id="email"
                    placeholder="example@test.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onFocus={(e) => handleFieldFocus("email")}
                  />
                </FormControl>
                <p style={{ color: "red", fontSize: "12px" }}>
                  {formRequired["email"] ? "This field is required" : ""}
                </p>

                <p style={{ color: "red", fontSize: "12px" }}>
                  {!validEmail && emailTouched ? "Email is not valid" : ""}
                </p>
              </Box>

              <Box>
                <FormControl
                  required
                  variant="standard"
                  sx={{ width: "500px", marginLeft: "60px" }}
                >
                  <InputLabel id="role">Role</InputLabel>
                  <Select
                    labelId="role"
                    id="role-select"
                    value={formData.role}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    onFocus={(e) => handleFieldFocus("role")}
                    label="Role"
                  >
                    <MenuItem value={"Manager"}>Manager</MenuItem>
                    <MenuItem value={"Fan"}>Fan</MenuItem>
                  </Select>
                </FormControl>
                <p
                  style={{ color: "red", marginLeft: "60px", fontSize: "12px" }}
                >
                  {formRequired["role"] ? "This field is required" : ""}
                </p>
              </Box>
            </Box>
            <Button
              variant="contained"
              sx={{ marginTop: "40px", width: "100px" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </StyledForm>
        </CenteredContainer>
      )}
    </div>
  );
}
