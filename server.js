const express = require("express");
const edm = require("./routes/api/edm");
const g66_tool = require("./routes/api/g66_tool");

const app = express();

app.use(express.json());
app.use("/api/edm", edm);
app.use("/api/g66_tool", g66_tool);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Sever is listening on port " + port));
