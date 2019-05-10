import axios from "axios";
import isEmpty from "../validation/is-empty";
import { GET_RANKING_LIST, GET_ERRORS, YOUTUBE_LOADING } from "./types";

export const getRankinglist = searchObject => dispatch => {
  dispatch(setLoading());
  let url = `https://www.googleapis.com/youtube/v3/search?part=id&order=viewCount&publishedAfter=${
    searchObject.begin_time
  }Z&publishedBefore=${
    searchObject.end_time
  }Z&maxResults=50&relevanceLanguage=zh-Hant&q=${searchObject.game_name} ${
    searchObject.keyword
  }&key=AIzaSyA1eg-j6R72gFWNC7k4Oem1hjLcJDpaU7U`;

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
      const url_video = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&hl=zh-Hant&id=${search_video_ids}&maxResults=50&key=AIzaSyA1eg-j6R72gFWNC7k4Oem1hjLcJDpaU7U`;
      axios.get(url_video).then(res => {
        dispatch({
          type: GET_RANKING_LIST,
          payload: { ...res.data, nextPageToken, prevPageToken }
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
