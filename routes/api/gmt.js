const express = require("express");
const router = express.Router();
const axios = require("axios");
const validateG66CSVInput = require("../../validation/v_g66");
const config = require("../../config/config");
router.get("/", (req, res) => {
  //const url = req.body.url;

  const url =
    "http://h54hmt.gameop.easebar.com/logs/h54hmt/report/20190531.log";

  //   const { errors, isValid } = validateG66CSVInput(req.body);
  //   if (!isValid) {
  //     return response.status(400).json(errors);
  //   }

  //console.log(req.body);
  axios
    .get(url, {
      auth: {
        username: "h54hmt_user",
        password: "h54hmt_user#123"
      }
    })
    .then(res => console.log(res.data))
    .catch(err => console.error(err.message));

  res.send("OK");
});

router.post("/get_complaint", (req, res) => {
  const url = req.body.url;

  const { errors, isValid } = validateG66CSVInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //console.log(req.body);

  axios
    .get(url, {
      auth: {
        username: config["h54_username"],
        password: config["h54_password"]
      }
    })
    .then(h54_res => {
      res.json(h54_res.data);
    })
    .catch(err => {
      return res.status(400).send(err.message);
    });
});
module.exports = router;
