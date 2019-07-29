import { GET_HOME_DATA, GET_CS_DATA } from "../actions/types";
const initialState = {
  home: {},
  cs_members: [],
  loading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_HOME_DATA:
      return {
        ...state,
        home: action.payload,
        loading: false
      };
    case GET_CS_DATA:
      return {
        ...state,
        cs_members: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
