const express = require("express");
const db = require("./data/database");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const { Console } = require("console");

const app = express();

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(bodyParser.json());

app.use(function (error, req, res, next) {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.log(error);
  res.status(500).render("500");
});

app.get("/user", async function (req, res) {
  const users = await db.getDb().collection("users").find().toArray();
  console.log(users);
  res.json(users);
});

app.get("/stadium/:id", async function (req, res) {
  const stadiumId = req.params.id;
  console.log("kkkkkkk", stadiumId);

  try {
    // Find the stadium by ID
    const stadium = await db
      .getDb()
      .collection("stadiums")
      .findOne({ _id: new ObjectId(stadiumId) });

    if (stadium) {
      res.json(stadium);
      console.log(stadium);
    } else {
      res.status(404).json({ error: "Stadium not found" });
    }
  } catch (error) {
    console.error("Error getting stadium:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/stadium", async function (req, res) {
  const stadiums = await db.getDb().collection("stadiums").find().toArray();
  console.log(stadiums);
  res.json(stadiums);
});

app.get("/user/:id", async function (req, res) {
  const userId = req.params.id;
  console.log("kkkkkkkhhhh user", userId);

  try {
    // Find the stadium by ID
    const user = await db
      .getDb()
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (user) {
      res.json(user);
      console.log(user);
    } else {
      res.status(404).json({ error: "user not found" });
    }
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/user/:id/edit", async (req, res) => {
  const userId = req.params.id;
  console.log("error", userId);
  try {
    // Assume req.body contains the updated user data
    const updatedUserData = req.body;
    console.log(updatedUserData);
    delete updatedUserData._id;

    // Update the user in the database
    const result = await db
      .getDb()
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: updatedUserData });

    if (result.acknowledged) {
      // User updated successfully
      res.json({ message: "User updated successfully" });
    } else {
      // No user found with the given ID
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/matches", async function (req, res) {
  const matches = await db.getDb().collection("matches").find().toArray();
  console.log(matches);
  res.json(matches);
});


app.post("/user", async (req, res) => {
  const formData = req.body;
  console.log(formData);

  try {
    // Insert the formData into the 'users' collection
    const result = await db.getDb().collection("users").insertOne(formData);

    console.log("Insert result:", result);

    if (result.acknowledged) {
      res.status(201).json({ success: true });
    } else {
      console.error(
        "Error inserting user: No user data returned from the database"
      );
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/stadium", async (req, res) => {
  const formData = req.body;
  console.log('staddddd create',formData);

  try {
    // Insert the formData into the '' collection
    const result = await db.getDb().collection("stadiums").insertOne(formData);

    console.log("Insert result:", result);

    if (result.acknowledged) {
      res.status(201).json({ success: true });
    } else {
      console.error(
        "Error inserting stadium: No stadium data returned from the database"
      );
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error inserting stadium:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// DELETE route to delete a reservation by ID
app.delete('/reservations/:id', async (req, res) => {
  const reservationId = req.params.id;

  try {
    // Check if the provided reservationId is a valid ObjectId
    if (!ObjectId.isValid(reservationId)) {
      return res.status(400).json({ error: 'Invalid reservation ID' });
    }

    // Convert reservationId to ObjectId
    const reservationObjectId = new ObjectId(reservationId);

    // Check if the reservation with the given ID exists
    const existingReservation = await db.getDb().collection('reservations').findOne({ _id: reservationObjectId });
    if (!existingReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Delete the reservation
    const deleteResult = await db.getDb().collection('reservations').deleteOne({ _id: reservationObjectId });

    if (deleteResult.acknowledged) {
      res.json({ success: true, message: 'Reservation deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete reservation' });
    }
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/signup", async (req, res) => {
  const formData = req.body;

  try {
    // Check if the user is already in the waiting list
    const waitingUser = await db
      .getDb()
      .collection("waitingList")
      .findOne({ userName: formData.userName });

    if (waitingUser) {
      // User is already in the waiting list
      res.status(200).json({ message: "You are already in the waiting list." });
    } else {
      // Add the user to the waiting list
      await db.getDb().collection("waitingList").insertOne(formData);
      res
        .status(201)
        .json({ message: "You have been added to the waiting list." });
    }
  } catch (error) {
    console.error("Error processing signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/match", async (req, res) => {
  const formData = req.body;

  console.log(formData);

  try {
    const matchData = {
      homeTeam: formData.homeTeam,
      awayTeam: formData.awayTeam,
      stadiumId: new ObjectId(formData.stadiumId),
      dateTime: new Date(
        formData.matchDatee.years,
        formData.matchDatee.months,
        formData.matchDatee.date,
        formData.matchTimee.hours,
        formData.matchTimee.minutes
      ),
      mainReferee: formData.mainReferee,
      linesmen: [formData.lineMan1, formData.lineMan2],
    };

    const result = await db.getDb().collection("matches").insertOne(matchData);

    console.log("Insert result:", result);

    if (result.acknowledged) {
      res.status(201).json({ success: true });
    } else {
      console.error(
        "Error inserting user: No  data returned from the database"
      );
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error inserting match:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/match/:id", async (req, res) => {
  const matchId = req.params.id;
  const formData = req.body;

  try {
    const updatedMatchData = {
      homeTeam: formData.homeTeam,
      awayTeam: formData.awayTeam,
      stadiumId: new ObjectId(formData.stadiumId),
      dateTime: new Date(
        formData.matchDatee.years,
        formData.matchDatee.months - 1, // Months are zero-based
        formData.matchDatee.date,
        formData.matchTimee.hours,
        formData.matchTimee.minutes
      ),
      mainReferee: formData.mainReferee,
      linesmen: [formData.lineMan1, formData.lineMan2],
    };

    const result = await db
      .getDb()
      .collection("matches")
      .updateOne({ _id: new ObjectId(matchId) }, { $set: updatedMatchData });

    console.log("Update result: uuuuuuuuuu", result);

    if (result.acknowledged) {
      res.status(200).json({ success: true });
    } else {
      console.error("Error updating match: No data returned from the database");
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error updating match:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all users from the waiting list
app.get("/waitinglist", async (req, res) => {
  try {
    const waitingList = await db
      .getDb()
      .collection("waitingList")
      .find({})
      .toArray();

    res.status(200).json(waitingList);
  } catch (error) {
    console.error("Error fetching waiting list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a user from the waiting list by ID
app.delete('/waitinglist/:id', async (req, res) => {
  const userId = req.params.id;
  console.log('hereeeeeeee1')


  try {
    const result = await db
      .getDb()
      .collection('waitingList')
      .deleteOne({ _id: new ObjectId(userId) });

    if (result.acknowledged) {
      console.log('hereeeeeeee')
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'User not found in the waiting list' });
    }
  } catch (error) {
    console.error('Error deleting user from waiting list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete a user from the waiting list by ID
app.delete('/user/:id/delete', async (req, res) => {
  const userId = req.params.id;
  console.log('hereeeeeeee2')


  try {
    const result = await db
      .getDb()
      .collection('users')
      .deleteOne({ _id: new ObjectId(userId) });

    if (result.acknowledged) {
      console.log('hereeeeeeee',userId)
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'User not found ' });
    }
  } catch (error) {
    console.error('Error deleting user :', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.post('/matches/:id/reservations', async (req, res) => {
//   const matchId = req.params.id;
//   const reservationData = req.body;

//   try {
//     // Insert reservation into the reservations collection
//     const result = await db.getDb().collection('reservations').insertOne(reservationData);

//     if (result.acknowledged) {
//       // Get the inserted reservation from the database
//       const insertedReservation = await db.getDb().collection('reservations').findOne({ _id: result.insertedId });

//       // Update the match document with the reservation
//       const updatedMatch = await db.getDb().collection('matches').updateOne(
//         { _id: new ObjectId(matchId) },
//         { $push: { reservations: insertedReservation } }
//       );

//       if (result.acknowledged && updatedMatch.acknowledged) {
//         res.json({ success: true, message: 'Reservation added successfully' });
//       } else {
//         res.status(500).json({ error: 'Failed to add reservation to match document' });
//       }
//     } else {
//       res.status(500).json({ error: 'Failed to add reservation to reservations collection' });
//     }
//   } catch (error) {
//     console.error('Error adding reservation:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.post("/matches/:id/reservations", async (req, res) => {
  const reservationData = req.body;

  // Convert customerId from string to ObjectId
  reservationData.customerId = new ObjectId(reservationData.customerId);
  reservationData.matchId = new ObjectId(reservationData.matchId);

  try {
    // Insert reservation into the reservations collection
    const result = await db
      .getDb()
      .collection("reservations")
      .insertOne(reservationData);

    if (result.acknowledged) {
      // Get the inserted reservation from the database

      res.json({ success: true, message: "Reservation added successfully" });
    } else {
      res
        .status(500)
        .json({
          error: "Failed to add reservation to reservations collection",
        });
    }
  } catch (error) {
    console.error("Error adding reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/matches/:id/reservations", async (req, res) => {
  const matchId = req.params.id;
  console.log("kkoooooookkkkk", matchId);

  try {
    const reservations = await db
      .getDb()
      .collection("reservations")
      .find({ matchId: new ObjectId(matchId) })
      .toArray();

    res.json(reservations);
    console.log(reservations);
  } catch (error) {
    console.error("Error fetching match reservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/user/:id/reservations", async (req, res) => {
  const userId = req.params.id;
  console.log("kkoooooookkkkk reservation user", userId);

  try {
    const reservations = await db
      .getDb()
      .collection("reservations")
      .find({ customerId: new ObjectId(userId) })
      .toArray();

    res.json(reservations);
    console.log(reservations);
  } catch (error) {
    console.error("Error fetching match reservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/matches/:id", async (req, res) => {
  const matchId = req.params.id;
  console.log("kkoooooookkkkk match", matchId);

  try {
    const match = await db
      .getDb()
      .collection("matches")
      .find({ _id: new ObjectId(matchId) })
      .toArray();

    res.json(match);
    console.log(match);
  } catch (error) {
    console.error("Error fetching match :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

db.connectToDatabase().then(function () {
  app.listen(5000, () => {
    console.log("server started");
  });
});
