require("dotenv").config();
const express = require("express");
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const db = require("./Model");
const cors = require('cors');
const yoga = require("./Route/route");

db.sequelize.sync()
  .then(() => {
    // console.log("Database synced")
  })
  .catch((error) =>
    console.log(error)
  )
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', yoga)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});