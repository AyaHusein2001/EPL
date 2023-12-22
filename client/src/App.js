import React, { useEffect, useState } from "react";
import Signup from "./pages/signup";
import Login from "./pages/login";
import MatchCard from "./components/matchCard";
import Matches from "./pages/matches";
import ReserveDialog from "./components/reserveDialog";
import Home from "./pages/Home";
function App() {

  return (
    // <MatchCard />

//     <MatchCard
//   country1Name="Germany"
//   country1Image="/images/germany.png"
//   country2Name="Argentina"
//   country2Image="/images/Argentina.png"
//   date="21/02/2024"
//   time="09:30"
// />
<Home />

    //   <div>
    //     {Array.isArray(backendData) && backendData.length ? (
    // backendData.map((user, i) => {
    //   return (
    //     <div key={i}>
    //       <p>Username: {user.username}</p>
    //       <p>Name: {`${user.firstName} ${user.lastName}`}</p>
    //       <p>Email: {user.email}</p>
    //       {/* Add more properties as needed */}
    //     </div>
    //     );
    //   })
    // ) : (
    //   <p>Loading...</p>
    // )}
    //     </div>
  );
}

export default App;
