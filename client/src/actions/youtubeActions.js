import axios from "axios";
import isEmpty from "../validation/is-empty";
import CONFIG from "./CONFIG";

import {
  GET_RANKING_LIST,
  GET_ERRORS,
  YOUTUBE_LOADING,
  CLEAR_LOADING,
  GET_CHANNEL_LIST,
  GET_YT_REPORTS,
  GET_YOUTUEBRS
} from "./types";

// router.post("/get_videos/:game_id", (req, res) => {
//   const game_id = req.params.game_id;
//   let search_criteria = ({ begin_date, end_date } = req.body);
// export const editEDM = (edm_id, edmData, history) => dispatch => {
//   dispatch(setEventsLoading());
//   axios
//     .post(`/api/edm/modify/${edm_id}`, edmData)

export const getYtReports = (game_id, search_criteria) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`/api/youtube/get_videos/${game_id}`, search_criteria)
    .then(res =>
      dispatch({
        type: GET_YT_REPORTS,
        payload: res.data.msg
      })
    )
    .catch(err =>
      dispatch({
        type: GET_YT_REPORTS,
        payload: []
      })
    );
};

export const getYoutubers = () => dispatch => {
  dispatch(setLoading());
  axios
    .get(`/api/youtube/get_youtubers/`)
    .then(res =>
      dispatch({
        type: GET_YOUTUEBRS,
        payload: res.data.msg
      })
    )
    .catch(err =>
      dispatch({
        type: GET_YOUTUEBRS,
        payload: []
      })
    );
};

export const getRankinglist = searchObject => dispatch => {
  dispatch(setLoading());
  let url = `https://www.googleapis.com/youtube/v3/search?part=id&order=${
    searchObject.sort_by
  }&publishedAfter=${searchObject.begin_time}Z&publishedBefore=${
    searchObject.end_time
  }Z&maxResults=50&relevanceLanguage=zh-Hant&q=${searchObject.game_name} ${
    searchObject.keyword
  }&relevanceLanguage=zh-Hant&key=${CONFIG.api_key}`;

  if (searchObject.channelId !== "") {
    url += `&channelId=${searchObject.channelId}`;
  }
  if (!isEmpty(searchObject.pageToken)) {
    url += `&pageToken=${searchObject.pageToken}`;
  }

  console.log(url);

  let nextPageToken, prevPageToken;

  axios
    .get(url)
    .then(res => {
      console.log(JSON.stringify(res.data));
      nextPageToken = res.data.nextPageToken ? res.data.nextPageToken : "";
      prevPageToken = res.data.prevPageToken ? res.data.prevPageToken : "";
      const search_video_ids = res.data.items
        .map(item => item.id.videoId)
        .join(",");
      const url_video = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&hl=zh-Hant&id=${search_video_ids}&maxResults=50&key=${
        CONFIG.api_key
      }`;

      //console.log("url_video", url_video);
      axios.get(url_video).then(res => {
        dispatch({
          type: GET_RANKING_LIST,
          payload: { ...res.data, nextPageToken, prevPageToken }
        });

        //console.log("res", res.data);

        const channelId_array = res.data.items.map(item => {
          return item.snippet.channelId;
        });

        //console.log("channelId_array", channelId_array);
        let filtered_result = channelId_array.sort().reduce((init, current) => {
          if (init.length === 0 || init[init.length - 1] !== current) {
            init.push(current);
          }
          return init;
        }, []);
        //console.log("filtered_result", JSON.stringify(filtered_result));

        const url_video = `https://www.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&hl=zh-Hant&id=${filtered_result.join(
          ","
        )}&maxResults=50&key=${CONFIG.api_key}`;

        axios.get(url_video).then(res => {
          dispatch({
            type: GET_CHANNEL_LIST,
            payload: { ...res.data, nextPageToken, prevPageToken }
          });
        });
      });
    })
    .catch(err => {
      //console.log(err.response.data.error.errors);
      dispatch(clearLoading());
      if (err.response.data.error) {
        console.log("get_ranking", err.response.data.error.errors);
        dispatch({
          type: GET_ERRORS,
          payload: { api_error: err.response.data.error.errors[0].message }
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      }
    });
};

export const setLoading = () => dispatch =>
  dispatch({
    type: YOUTUBE_LOADING
  });
export const clearLoading = () => dispatch =>
  dispatch({
    type: CLEAR_LOADING
  });
// {
//   "error": {
//    "errors": [
//     {
//      "domain": "youtube.quota",
//      "reason": "quotaExceeded",
//      "message": "The request cannot be completed because you have exceeded your \u003ca href=\"/youtube/v3/getting-started#quota\"\u003equota\u003c/a\u003e."
//     }
//    ],
//    "code": 403,
//    "message": "The request cannot be completed because you have exceeded your \u003ca href=\"/youtube/v3/getting-started#quota\"\u003equota\u003c/a\u003e."
//   }
//  }
