const express = require("express");
const router = express.Router();
const http = require("http");
const validateG66CSVInput = require("../../validation/v_g66");
router.post("/", (req, response) => {
  const url = req.body.url;

  const { errors, isValid } = validateG66CSVInput(req.body);
  if (!isValid) {
    return response.status(400).json(errors);
  }

  //console.log(req.body);
  http
    .get(url, res => {
      const { statusCode } = res;
      const contentType = res.headers["content-type"];

      let error;
      if (statusCode !== 200) {
        error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
      }
      //else if (!/^application\/json/.test(contentType)) {
      //   error = new Error(
      //     "Invalid content-type.\n" +
      //       `Expected application/json but received ${contentType}`
      //   );
      // }
      if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", chunk => {
        //chunk.split("\\t");
        //console.log("************");
        //console.log(chunk.substr(0, 20));
        rawData += chunk;
      });
      res.on("end", () => {
        let newData = "";
        try {
          // const parsedData = JSON.parse(rawData);
          // console.log(parsedData);
          //resolve(rawData);

          // var lines = rawData.split("\n");
          // let colIndex = 0;
          // for (var line = 0; line < lines.length; line++) {
          //   // By tabs
          //   console.log(line);
          //   var tabs = lines[line].split("\t");
          //   for (var tab = 0; tab < tabs.length; tab++) {
          //     //alert(tabs[tab]);
          //     if (tabs[tab] === "item_attr_str") {
          //       colIndex = tab;
          //     }
          //   }
          //   if (tabs[colIndex] !== undefined) {
          //     item_attr_str = tabs[colIndex].replace("{equip=", "");
          //     let removeIndexStart = item_attr_str.lastIndexOf(",");
          //     item_attr_str = item_attr_str.substring(0, removeIndexStart);
          //     if (line > 0) {
          //       let itemObj = JSON.parse(item_attr_str);

          //       newData += tabs[colIndex] + "\t";
          //       newData += itemObj.item_id + "\n";
          //     }
          //   }
          //   //console.log(item_attr_str);
          // }
          response.send(rawData);
        } catch (e) {
          console.error(e.message);
          response.send(rawData);
        }
      });
    })
    .on("error", e => {
      console.error(`Got error: ${e.message}`);
    });
});

module.exports = router;
