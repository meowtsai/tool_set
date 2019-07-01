import {
  GET_RANKING_LIST,
  YOUTUBE_LOADING,
  CLEAR_LOADING,
  GET_CHANNEL_LIST,
  GET_YT_REPORTS,
  GET_YOUTUEBRS,
  GET_YOUTUEBR,
  GET_CHART_FILES,
  GET_CHART_DATA,
  FOLLOW_CHANNEL
} from "../actions/types";

const initialState = {
  ranking_list: [],
  channel_list: [],
  youtubers: [],
  youtuber: {},
  yt_reports: [],
  chart_filenames: [],
  chart_data: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_RANKING_LIST:
      return {
        ...state,
        ranking_list: action.payload,
        channel_list: [],
        loading: false
      };
    case GET_CHANNEL_LIST:
      return {
        ...state,
        channel_list: action.payload,
        loading: false
      };
    case GET_YT_REPORTS:
      return {
        ...state,
        yt_reports: action.payload,
        loading: false
      };
    case GET_YOUTUEBRS:
      return {
        ...state,
        youtubers: action.payload,
        loading: false
      };
    case GET_YOUTUEBR:
      return {
        ...state,
        youtuber: action.payload,
        loading: false
      };
    case FOLLOW_CHANNEL:
      return {
        ...state,
        youtubers: [
          ...state.youtubers.map(yt => {
            if (yt.id === action.payload.id) {
              yt.following = action.payload.action;
              return yt;
            } else {
              return yt;
            }
          })
        ],
        loading: false
      };
    case GET_CHART_FILES:
      return {
        ...state,
        chart_filenames: action.payload,
        loading: false
      };
    case GET_CHART_DATA:
      return {
        ...state,
        chart_data: action.payload,
        loading: false
      };
    case YOUTUBE_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_LOADING:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
}
