const express = require("express");
const router = express.Router();
const https = require("https");
const axios = require("axios");
const validateYoutuberInput = require("../../validation/v_youtuber");
const Youtubers = require("../../models/youtuberModel");
const YoutuberVideo = require("../../models/videoModel");

const config = require("../../config/config");

const google_api_yt = "https://www.googleapis.com/youtube/v3";
const isEmpty= require('../../validation/is-empty')

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

//@route: POST /api/youtube/create
//@desc: create an edm
//@access: public
router.post("/create", (req, res) => {
  const { errors, isValid } = validateYoutuberInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  let youtube_id = req.body.id;
  Youtubers.create(youtube_id)
    .then(createResult => {
      if (createResult.status === 1) {
        res.send(createResult);
      } else {
        res.status(400).send(createResult);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
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
  const d1 = "2019-05-01T00:00:00Z";
  const d2 = "2019-05-28T00:00:00Z";

  
  if (isEmpty(req.query.keyword) || isEmpty(req.query.game_id)){
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
        console.log("processing ", yts.msg[idx_y].title);
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

router.get("/get_videos/:game_id", (req, res) => {
  const game_id = req.params.game_id;
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
module.exports = router;

// {
//   "kind": "youtube#searchListResponse",
//   "etag": "\"XpPGQXPnxQJhLgs6enD_n8JR4Qk/Opca8J64Wo-fMYuwyU6fkP82NBI\"",
//   "nextPageToken": "CDIQAA",
//   "regionCode": "TW",
//   "pageInfo": {
//    "totalResults": 119,
//    "resultsPerPage": 50
//   },
//   "items": [
//    {
//     "kind": "youtube#searchResult",
//     "etag": "\"XpPGQXPnxQJhLgs6enD_n8JR4Qk/VrW3SHirHju9s5ZTDadCzg8XzCA\"",
//     "id": {
//      "kind": "youtube#video",
//      "videoId": "I7jU7gv_fqk"
//     }

// {
//   "kind": "youtube#videoListResponse",
//   "etag": "\"XpPGQXPnxQJhLgs6enD_n8JR4Qk/F4guKDg4IZixuXIAY4df2_JZmcc\"",
//   "pageInfo": {
//       "totalResults": 50,
//       "resultsPerPage": 50
//   },
//   "items": [
//       {
//           "kind": "youtube#video",
//           "etag": "\"XpPGQXPnxQJhLgs6enD_n8JR4Qk/927FQ4npR7s_XZjve_bILLZhdQ0\"",
//           "id": "I7jU7gv_fqk",
//           "snippet": {
//               "publishedAt": "2019-05-05T07:31:01.000Z",
//               "channelId": "UC0nDjH1yo1gRvO29UhJGOfA",
//               "title": "【第五人格共研服】五排模式 上線共研服！∑(ﾟДﾟ) 5v5全新排位模式！好正式的感覺！ps:偶遇虛偽‼︎",
//               "description": "",
//               "thumbnails": {
//                   "default": {
//                       "url": "https://i.ytimg.com/vi/I7jU7gv_fqk/default.jpg",
//                       "width": 120,
//                       "height": 90
//                   },
//                   "medium": {
//                       "url": "https://i.ytimg.com/vi/I7jU7gv_fqk/mqdefault.jpg",
//                       "width": 320,
//                       "height": 180
//                   },
//                   "high": {
//                       "url": "https://i.ytimg.com/vi/I7jU7gv_fqk/hqdefault.jpg",
//                       "width": 480,
//                       "height": 360
//                   },
//                   "standard": {
//                       "url": "https://i.ytimg.com/vi/I7jU7gv_fqk/sddefault.jpg",
//                       "width": 640,
//                       "height": 480
//                   },
//                   "maxres": {
//                       "url": "https://i.ytimg.com/vi/I7jU7gv_fqk/maxresdefault.jpg",
//                       "width": 1280,
//                       "height": 720
//                   }
//               },
//               "channelTitle": "阿拉蕾",
//               "tags": [
//                   "第五人格",
//                   "阿拉蕾",
//                   "共研服"
//               ],
//               "categoryId": "20",
//               "liveBroadcastContent": "none",
//               "localized": {
//                   "title": "【第五人格共研服】五排模式 上線共研服！∑(ﾟДﾟ) 5v5全新排位模式！好正式的感覺！ps:偶遇虛偽‼︎",
//                   "description": ""
//               },
//               "defaultAudioLanguage": "zh-TW"
//           },
//           "statistics": {
//               "viewCount": "73638",
//               "likeCount": "1532",
//               "dislikeCount": "66",
//               "favoriteCount": "0",
//               "commentCount": "379"
//           }
//       },
