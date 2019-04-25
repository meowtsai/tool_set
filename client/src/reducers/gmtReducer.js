import { DATA_LOADING, GET_CSV } from "../actions/types";

const initialState = {
  csv: "",
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CSV:
      return {
        ...state,
        csv: action.payload,
        loading: false
      };

    case DATA_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
