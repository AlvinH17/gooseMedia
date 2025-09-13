const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let counter = 0;

app.get("/", (req, res) => {
  res.send("Welcome to the Change Plus Plus Workshop!");
});

app.get("/counter", (req, res) => {
  res.json({ counter: counter });
});

app.post("/counter/increment", (req, res) => {
  counter++;
  res.json({ counter: counter });
});

app.post("/counter/decrement", (req, res) => {
  counter--;
  res.json({ counter: counter });
});

app.post("/counter/reset", (req, res) => {
  counter = 0; // Actually reset the counter
  res.json({ counter: counter, message: "Counter reset successfully" });
});

app.get("/msg", (req, res) => {
  res.json({ counter: counter });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
