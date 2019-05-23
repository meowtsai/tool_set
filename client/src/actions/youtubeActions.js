import axios from "axios";
import isEmpty from "../validation/is-empty";
import CONFIG from "./CONFIG";

import {
  GET_RANKING_LIST,
  GET_ERRORS,
  YOUTUBE_LOADING,
  GET_CHANNEL_LIST
} from "./types";

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

  let nextPageToken, prevPageToken;

  axios
    .get(url)
    .then(res => {
      //console.log(res.data);
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
    .catch(err =>
      dispatch({
        type: GET_RANKING_LIST,
        payload: []
      })
    );
};

export const setLoading = () => dispatch =>
  dispatch({
    type: YOUTUBE_LOADING
  });
