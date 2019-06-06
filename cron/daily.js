const axios = require("axios");
const config = require("../config/config");

const path = require("path");
const fs = require("fs");
const moment = require("moment");

const google_api_yt = "https://www.googleapis.com/youtube/v3";
const url =
  google_api_yt +
  `/videos?part=snippet,statistics&chart=mostPopular&regionCode=tw&videoCategoryId=20&maxResults=50&key=${
    config.api_key
  }`;
// 1. get youtube most popular chart categoryid=20 Data
axios
  .get(url)
  .then(res => {
    //const data = new Uint8Array(Buffer.from("Hello Node.js"));
    // 2. save the data to a text file , /chart_data/20190605.json
    const directoryPath = path.join(__dirname, "/chart_data");

    const filename = `${moment().format("YYYYMMDD")}.json`;
    fs.writeFile(
      `${directoryPath}/${filename}`,
      JSON.stringify(res.data),
      err => {
        if (err) throw err;
        console.log(`The file ${filename} has been saved.`);
      }
    );
  })
  .catch(err => {
    console.error(err.message);
  });

axios
  .get("https://manager.longeplay.com.tw:5000/api/youtube/fetch_update")
  .then(res => {
    console.log("update yotubers result:" + res);
  })
  .catch(err => {
    console.error(err.message);
  });

// 3. Done
