// Import required libraries
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

// Set up the data file
const dataFile = "data.json";
let data = [];

if (fs.existsSync(dataFile)) {
  data = JSON.parse(fs.readFileSync(dataFile));
} else {
  fs.writeFileSync(dataFile, JSON.stringify(data));
}

// Create the Express application
const app = express();

// Use the required middleware
app.use(bodyParser.json());
app.use(cors());

// Define the API routes
app.get("/rooms", (req, res) => {
  res.json(data);
});

app.post("/rooms", (req, res) => {
  const room = {
    id: data.length + 1,
    name: req.body.name,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price: req.body.price,
    bookings: [],
  };

  data.push(room);
  fs.writeFileSync(dataFile, JSON.stringify(data));
  res.json(room);
});

app.post("/bookings", (req, res) => {
  const roomId = req.body.roomId;
  const room = data.find((room) => room.id === roomId);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const booking = {
    id: room.bookings.length + 1,
    customerName: req.body.customerName,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    date: new Date(),
    status: "Booked",
  };

  room.bookings.push(booking);
  fs.writeFileSync(dataFile, JSON.stringify(data));
  res.json(booking);
});

app.get("/bookings", (req, res) => {
  const bookings = [];

  data.forEach((room) => {
    room.bookings.forEach((booking) => {
      bookings.push({
        roomName: room.name,
        customerName: booking.customerName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
      });
    });
  });

  res.json(bookings);
});

app.get("/customers", (req, res) => {
  const customers = [];

  data.forEach((room) => {
    room.bookings.forEach((booking) => {
      customers.push({
        customerName: booking.customerName,
        roomName: room.name,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
    });
  });

  res.json(customers);
});

app.get("/bookings/:customerName/:roomId/:startTime/:endTime", (req, res) => {
  const customerName = req.params.customerName;
  const roomId = parseInt(req.params.roomId);
  const startTime = req.params.startTime;
  const endTime = req.params.endTime;

  const bookings = data.reduce((acc, room) => {
    room.bookings.forEach((booking) => {
      if (
        booking.customerName === customerName &&
        room.id === roomId &&
        booking.startTime === startTime &&
        booking.endTime === endTime
      ) {
        acc.push({
          customerName: booking.customerName,
          roomName: room.name,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          bookingId: booking.id,
          bookingDate: booking.date,
          bookingStatus: booking.status,
        });
      }
    });
    return acc;
  }, []);

  res.json(bookings);
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
``;
