const express = require("express");
const router = express.Router();
const https = require("https");

router.get("/get_rankinglist", (req, res) => {
  const game_name = req.query.game_name;
  //res.json({ status: 1, msg: { a: "123" } });
  const url =
    "https://www.googleapis.com/youtube/v3/search?part=id&order=viewCount&publishedAfter=2019-05-01T00:00:00Z&publishedBefore=2019-05-04T00:00:00Z&relevanceLanguage=zh-Hant&q=%E7%AC%AC%E4%BA%94%E4%BA%BA%E6%A0%BC&key=AIzaSyA1eg-j6R72gFWNC7k4Oem1hjLcJDpaU7U";
  https.get(url, yt_result => {
    res.json(yt_result);
  });
});

// curl \
//   'https://www.googleapis.com/youtube/v3/search?part=id&order=viewCount&publishedAfter=2019-05-01T00:00:00Z&publishedBefore=2019-05-04T00:00:00Z&relevanceLanguage=zh-Hant&pageToken=CAUQAA&q=%E7%AC%AC%E4%BA%94%E4%BA%BA%E6%A0%BC&key=AIzaSyA1eg-j6R72gFWNC7k4Oem1hjLcJDpaU7U' \
//   --header 'Accept: application/json' \
//   --compressed

module.exports = router;
