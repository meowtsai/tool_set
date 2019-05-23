import {
  GET_RANKING_LIST,
  YOUTUBE_LOADING,
  GET_CHANNEL_LIST
} from "../actions/types";

const initialState = {
  ranking_list: [],
  channel_list: [],
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

    case YOUTUBE_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
