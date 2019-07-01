const express = require("express");
const router = express.Router();
const https = require("https");
const axios = require("axios");
const validateYoutuberInput = require("../../validation/v_youtuber");
const Youtubers = require("../../models/youtuberModel");
const YoutuberVideo = require("../../models/videoModel");
const fs = require("fs");
const path = require("path");
const config = require("../../config/config");

const google_api_yt = "https://www.googleapis.com/youtube/v3";
const isEmpty = require("../../validation/is-empty");

router.get("/get_rankinglist", (req, res) => {
  const game_name = req.query.game_name;
  //res.json({ status: 1, msg: { a: "123" } });
  const url =
    "https://www.googleapis.com/youtube/v3/search?part=id&order=viewCount&publishedAfter=2019-05-01T00:00:00Z&publishedBefore=2019-05-04T00:00:00Z&relevanceLanguage=zh-Hant&q=%E7%AC%AC%E4%BA%94%E4%BA%BA%E6%A0%BC&key=";
  https.get(url, yt_result => {
    res.json(yt_result);
  });
});

//@route: GET /api/youtube/get_youtubers
//@desc: return all get_youtubers
//@access: public
router.get("/get_youtubers", (req, res) => {
  Youtubers.get_all()
    .then(data => {
      if (data.status === 1) {
        res.send(data);
      } else {
        res.status(400).send(data);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

//@route: GET /api/edm/youtube/:youtuber_id
//@desc: return youtuber data by its id
//@access: public
router.get("/get_youtuber/:youtuber_id", (req, res) => {
  const youtuber_id = req.params.youtuber_id;
  Youtubers.get_one(youtuber_id)
    .then(yt_data => {
      if (yt_data.status === 1) {
        res.send(yt_data);
      } else {
        res.status(400).send(yt_data);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

//@route: POST /api/youtube/channel/create
//@desc: create an edm
//@access: public
router.post("/channel/create", async (req, res) => {
  const { errors, isValid } = validateYoutuberInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  let youtube_id = req.body.id;
  Youtubers.create(youtube_id).then(createResult => {
    if (createResult.status === 1) {
      //新增成功, 到youtube 取得即時資料
      //console.log("createResult", createResult);
      get_channel_by_id(youtube_id)
        .then(ggl_response => {
          //3. update one by one

          //const jObj = JSON.parse();

          //console.log("ggl_response", ggl_response);
          const items = ggl_response.items;
          //console.log(items);
          items.forEach(item => {
            const youtuber = {
              title: item.snippet.title,
              published_at: new Date(item.snippet.publishedAt),
              thumbnails: item.snippet.thumbnails.default.url,
              update_time: new Date(),
              country: item.snippet.country,
              view_count: item.statistics.viewCount,
              subscriber_count: item.statistics.subscriberCount,
              video_count: item.statistics.videoCount
            };
            console.log(youtuber);
            Youtubers.modify(item.id, youtuber);
          });
          res.send(createResult);
        })
        .catch(function(error) {
          return res.status(400).json(error.message);
        });
    } else {
      res.status(400).json({ id: "重複輸入" + createResult.msg });
    }
  });
});

//@route: POST /api/edm/modify/:edm_id
//@desc: update edm content by its id
//@access: public
router.post("/modify/:edm_id", (req, res) => {
  const edm_id = req.params.edm_id;
  let edm = ({ id, title, mail_content } = req.body);
  Youtubers.modify(edm_id, edm)
    .then(modifyResult => {
      if (modifyResult.status === 1) {
        res.send(modifyResult);
      } else {
        res.status(400).send(modifyResult);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

//@route: DELETE /api/edm/delete/:edm_id
//@desc: delete an edm by its id
//@access: public
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  Youtubers.delete(id)
    .then(modifyResult => {
      if (modifyResult.status === 1) {
        res.send(modifyResult);
      } else {
        res.status(400).send(modifyResult);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

//call this api to update all the youtuber data listed in DB
router.get("/fetch_update", (req, res) => {
  //1. get list of id from my db
  Youtubers.get_all()
    .then(result => {
      const id_list = result.msg.map(yt => yt.id);
      //2. call google api to get infomation
      // console.log(
      //   google_api_yt +
      //     `/channels?part=snippet,statistics&id=${id_list.join(
      //       ","
      //     )}&maxResults=${id_list.length}&key=${config.api_key}`
      // );
      return axios.get(
        google_api_yt +
          `/channels?part=snippet,statistics&id=${id_list.join(
            ","
          )}&maxResults=${id_list.length}&key=${config.api_key}`
      );
    })
    .then(ggl_response => {
      //3. update one by one

      //res.json(ggl_response);
      //const jObj = JSON.parse();
      const items = ggl_response.data.items;
      items.forEach(item => {
        const youtuber = {
          title: item.snippet.title,
          published_at: new Date(item.snippet.publishedAt),
          thumbnails: item.snippet.thumbnails.default.url,
          update_time: new Date(),
          country: item.snippet.country,
          view_count: item.statistics.viewCount,
          subscriber_count: item.statistics.subscriberCount,
          video_count: item.statistics.videoCount
        };
        //console.log(youtuber);
        Youtubers.modify(item.id, youtuber);
      });

      res.send("OK");
    })
    .catch(function(error) {
      //console.log(error);
    });
});

//call this api to update all the youtuber data listed in DB
router.get("/fetch_videos/:yt_id", async (req, res) => {
  const yt_id = req.params.yt_id;
  const d1 = "2019-05-01T00:00:00Z";
  const d2 = "2019-05-28T00:00:00Z";
  const keyword = encodeURI("第五人格");
  const url =
    google_api_yt +
    `/search?part=id&channelId=${yt_id}&order=viewCount&publishedAfter=${d1}&publishedBefore=${d2}&maxResults=50&relevanceLanguage=zh-Hant&q=${keyword}&key=${
      config.api_key
    }`;
  get_idlist(url)
    .then(id_list_array => {
      //console.log("id_list_array", id_list_array);
      //1. get detail info of the videos retrived from first page
      //2. insert into db
      //3. see if there is next page , if yes go back to step 1 with nextpage token
      for (let idx = 0; idx < id_list_array.length; idx++) {
        const element = id_list_array[idx];
        const items_array = element.map(item => item.id.videoId);
        //console.log("items_array" + idx, items_array);
        get_videos_by_idlist(items_array).then(video_detail_list => {
          //console.log("video_detail_list", video_detail_list);
          const videos_items = video_detail_list.items;
          videos_items.forEach(video => {
            YoutuberVideo.get_one(video.id).then(vData => {
              if (vData.status === 1) {
                YoutuberVideo.modify(video.id, {
                  title: video.snippet.title,
                  published_at: new Date(video.snippet.publishedAt),
                  update_time: new Date(),
                  channelId: video.snippet.channelId,
                  view_count: video.statistics.viewCount,
                  like_count: video.statistics.likeCount,
                  dislike_count: video.statistics.dislikeCount,
                  comment_count: video.statistics.commentCount
                });
              } else {
                YoutuberVideo.create({
                  id: video.id,
                  title: video.snippet.title,
                  published_at: new Date(video.snippet.publishedAt),
                  update_time: new Date(),
                  channelId: video.snippet.channelId,
                  view_count: video.statistics.viewCount,
                  like_count: video.statistics.likeCount,
                  dislike_count: video.statistics.dislikeCount,
                  comment_count: video.statistics.commentCount
                });
              }
            });
          });
        });
      }

      res.send({ status: 1, msg: id_list_array });
    })
    .catch(function(error) {
      console.log(error);
      res.send(error);
    });
});

router.get("/fetch_videos_all", async (req, res) => {
  const d1 = "2019-06-01T00:00:00Z";
  const d2 = "2019-06-30T23:59:59Z";

  if (isEmpty(req.query.keyword) || isEmpty(req.query.game_id)) {
    res.send("No keyword & game_id params!");
    return;
  }

  const keyword = encodeURI(req.query.keyword);
  const game_id = req.query.game_id;

  // const keyword = encodeURI("荒野行動");
  // const game_id = "g83tw";
  Youtubers.get_all()
    .then(yts => {
      for (let idx_y = 0; idx_y < yts.msg.length; idx_y++) {
        const yt_id = yts.msg[idx_y].id;
        if (
          yts.msg[idx_y].games_group !== null &&
          yts.msg[idx_y].games_group.indexOf(game_id) > -1
        ) {
          console.log("processing ", yts.msg[idx_y].title);
          //res.send({ status: 1, msg: "DONE" });
          //return;
          const url =
            google_api_yt +
            `/search?part=id&channelId=${yt_id}&order=viewCount&publishedAfter=${d1}&publishedBefore=${d2}&maxResults=50&relevanceLanguage=zh-Hant&q=${keyword}&key=${
              config.api_key
            }`;
          get_idlist(url)
            .then(id_list_array => {
              //console.log("id_list_array", id_list_array);
              //1. get detail info of the videos retrived from first page
              //2. insert into db
              //3. see if there is next page , if yes go back to step 1 with nextpage token
              for (let idx = 0; idx < id_list_array.length; idx++) {
                const element = id_list_array[idx];
                const items_array = element.map(item => item.id.videoId);
                //console.log("items_array" + idx, items_array);
                get_videos_by_idlist(items_array).then(video_detail_list => {
                  //console.log("video_detail_list", video_detail_list);
                  const videos_items = video_detail_list.items;
                  videos_items.forEach(video => {
                    YoutuberVideo.get_one(video.id).then(vData => {
                      if (vData.status === 1) {
                        YoutuberVideo.modify(video.id, {
                          title: video.snippet.title,
                          published_at: new Date(video.snippet.publishedAt),
                          update_time: new Date(),
                          channelId: video.snippet.channelId,
                          view_count: video.statistics.viewCount,
                          like_count: video.statistics.likeCount,
                          dislike_count: video.statistics.dislikeCount,
                          comment_count: video.statistics.commentCount,
                          game_id
                        });
                      } else {
                        YoutuberVideo.create({
                          id: video.id,
                          title: video.snippet.title,
                          published_at: new Date(video.snippet.publishedAt),
                          update_time: new Date(),
                          channelId: video.snippet.channelId,
                          view_count: video.statistics.viewCount,
                          like_count: video.statistics.likeCount,
                          dislike_count: video.statistics.dislikeCount,
                          comment_count: video.statistics.commentCount,
                          game_id
                        });
                      }
                    });
                  });
                });
              }
            })
            .catch(function(error) {
              console.log(error);
              res.send(error);
            });
        }
      }
      res.send({ status: 1, msg: "DONE" });
    })
    .catch(err => console.log(err));
});

router.get("/get_video/:video_id", (req, res) => {
  const video_id = req.params.video_id;
  YoutuberVideo.get_one(video_id)
    .then(yt_data => {
      if (yt_data.status === 1) {
        res.send(yt_data);
      } else {
        res.status(400).send(yt_data);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

// router.get("/get_videos/:game_id", (req, res) => {
//   const game_id = req.params.game_id;
//   YoutuberVideo.get_one(video_id)
//     .then(yt_data => {
//       if (yt_data.status === 1) {
//         res.send(yt_data);
//       } else {
//         res.status(400).send(yt_data);
//       }
//     })
//     .catch(err => res.status(400).send({ status: -1, msg: err.message }));
// });

//@route: POST /api/edm/modify/:edm_id
//@desc: update edm content by its id
//@access: public
router.post("/get_videos/:game_id", (req, res) => {
  const game_id = req.params.game_id;
  let search_criteria = ({ begin_date, end_date } = req.body);
  YoutuberVideo.get_videos_by_game_id(
    game_id,
    search_criteria.begin_date,
    search_criteria.end_date
  )
    .then(result => {
      if (result.status === 1) {
        res.send(result);
      } else {
        res.status(400).send(result);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

//@route: GET /api/youtube/chart/getfiles
//@desc: get all the files under cron/chart_data
//@access: public
router.get("/chart/getfiles", (req, res) => {
  //console.log("getfiles called");
  const directoryPath = path.join(__dirname, "../../cron/chart_data");
  fs.readdir(directoryPath, function(err, files) {
    //handling error
    if (err) {
      return res.status(400).send("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    res.send(files);
  });
});
//@route: GET /api/youtube/chart/getdata/${filename}
//@desc: get all the files under cron/chart_data
//@access: public
router.get("/chart/getfiles/:filename", (req, res) => {
  const directoryPath = path.join(__dirname, "../../cron/chart_data");
  const filename = req.params.filename;

  fs.readFile(`${directoryPath}/${filename}.json`, (err, data) => {
    if (err) {
      return res.status(400).send("Unable to read file: " + err);
    }

    res.send(JSON.parse(data));
  });
});

//
async function get_idlist(google_api_yt) {
  //get initial data
  const rtnData = await axios.get(google_api_yt);
  //console.log("rtnData", rtnData);
  let { nextPageToken, pageInfo, items } = rtnData.data;
  let page_num =
    pageInfo.totalResults > pageInfo.resultsPerPage
      ? Math.ceil(pageInfo.totalResults / pageInfo.resultsPerPage)
      : 1; //page number
  let id_list_array = [items];
  for (let index = 1; index < page_num; index++) {
    let url = google_api_yt + `&pageToken=${nextPageToken}`;

    const rtnData2 = await axios.get(url);
    //console.log("rtnData2", rtnData2.data);
    nextPageToken = rtnData2.data.nextPageToken;
    id_list_array.push(rtnData2.data.items);
  }

  return id_list_array;
}
async function get_videos_by_idlist(idList) {
  const url =
    google_api_yt +
    `/videos?part=snippet,statistics&id=${idList.join(",")}&maxResults=50&key=${
      config.api_key
    }`;

  const rtnData = await axios.get(url);
  return rtnData.data;
}

async function get_channel_by_id(channel_id) {
  //console.log(channel_id);
  const url =
    google_api_yt +
    `/channels?part=snippet,statistics&id=${channel_id}&maxResults=50&key=${
      config.api_key
    }`;

  //console.log(url);
  const rtnData = await axios.get(url);
  //console.log(rtnData.data);
  return rtnData.data;
}
module.exports = router;
