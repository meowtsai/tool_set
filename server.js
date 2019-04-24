const express = require("express");
const edm = require("./routes/api/edm");
const app = express();

app.use(express.json());
app.use("/api/edm", edm);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Sever is listening on port " + port));
