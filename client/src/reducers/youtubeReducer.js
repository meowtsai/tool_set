import { GET_RANKING_LIST, YOUTUBE_LOADING } from "../actions/types";

const initialState = {
  ranking_list: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_RANKING_LIST:
      return {
        ...state,
        ranking_list: action.payload,
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
