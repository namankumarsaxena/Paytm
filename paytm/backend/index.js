const express = require("express");
const cors = require('cors');
const { connectionDB } = require('./db');
const rootRouter = require("./routes");

const app = express();

connectionDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
