const express = require("express"); // NodeJs
const { connect } = require("mongoose"); // for mongodb data store
require("dotenv").config(); // reads .env files
const cors = require("cors"); // bridges frontend to backend
const upload = require("express-fileupload"); // lets user upload files
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const routes = require("./routes/routes");
const { server, app } = require("./socket/socket");

const authMiddleware = require("./middleware/authMiddleware");

// const app = express(); // creates the server instance using express
// app.use(authMiddleware);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
// app.use(cors()); // allow all origins for testing
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your React app's URL
    credentials: true,
  })
);
app.use(upload()); // enables file upload handling

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URL) // connects to MongoDB using URL from .env
  .then(
    server.listen(
      process.env.PORT,
      () => console.log(`Server started on port ${process.env.PORT}`) // starts server if connection successful
    )
  )
  .catch((err) => console.log(err)); // logs error if connection unsuccessful
