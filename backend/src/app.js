const express = require("express");
const cors = require("cors");

require("./database/db");

const smartRoutes = require("./routes/smartRoutes");
const loggerService = require("./services/loggerService");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("SMART Monitoring API Running");
});

app.use("/api/smart", smartRoutes);

// Log immediately when server starts
loggerService.logSmartData();

// Log every hour
setInterval(
    loggerService.logSmartData,
    60 * 60 * 1000
);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
    console.log("HOME ROUTE HIT");
    res.send("SMART Monitoring API Running");
});