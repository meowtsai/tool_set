const express = require("express");
const edm = require("./routes/api/edm");
const g66_tool = require("./routes/api/g66_tool");
const path = require("path");
const app = express();

app.use(express.json());
app.use("/api/edm", edm);
app.use("/api/g66_tool", g66_tool);

//serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //set a static folder
  app.use(express.static("client/build"));
  //set a route for anything else not list above
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

var config = require("./config/config")[app.get("env")];
const port = config.port; // production mode will return 3001
//const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Sever is listening on port " + port));
