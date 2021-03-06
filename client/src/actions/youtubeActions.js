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
  GET_YOUTUEBRS,
  GET_YOUTUEBR,
  GET_CHART_FILES,
  GET_CHART_DATA,
  FOLLOW_CHANNEL
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
export const getYoutuber = yt_id => dispatch => {
  dispatch(setLoading());
  axios
    .get(`/api/youtube/get_youtuber/${yt_id}`)
    .then(res =>
      dispatch({
        type: GET_YOUTUEBR,
        payload: res.data.msg
      })
    )
    .catch(err =>
      dispatch({
        type: GET_YOUTUEBR,
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
export const getChartFiles = () => dispatch => {
  dispatch(setLoading());
  axios
    .get(`/api/youtube/chart/getfiles`)
    .then(res => {
      //console.log("getChartFiles", res.data);
      dispatch({
        type: GET_CHART_FILES,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_CHART_FILES,
        payload: []
      })
    );
};
export const getChartData = filename => dispatch => {
  dispatch(setLoading());
  axios
    .get(`/api/youtube/chart/getfiles/${filename}`)
    .then(res =>
      dispatch({
        type: GET_CHART_DATA,
        payload: res.data.items
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CHART_DATA,
        payload: {}
      })
    );
};

export const setLoading = () => dispatch =>
  dispatch({
    type: YOUTUBE_LOADING
  });
export const clearLoading = () => dispatch =>
  dispatch({
    type: CLEAR_LOADING
  });

export const createChannel = (ChannelData, history) => dispatch => {
  axios
    .post("/api/youtube/channel/create", ChannelData)
    .then(res => history.push("/youtube/channel/list"))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const modifyChannel = (ChannelData, history) => dispatch => {
  axios
    .post("/api/youtube/channel/modify", ChannelData)
    .then(res => history.push("/youtube/channel/list"))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const followChannel = ChannelData => dispatch => {
  dispatch(setLoading());
  //console.log("followChannel", ChannelData);
  axios
    .post("/api/youtube/channel/follow", ChannelData)
    .then(res => {
      console.log("followChannel", res.data);
      dispatch({
        type: FOLLOW_CHANNEL,
        payload: ChannelData
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
