import {
  EVENT_LOADING,
  GET_EVENTS,
  GET_EDMS,
  GET_EDM,
  DELETE_EDM,
  UPDATE_EDM
} from "../actions/types";

const initialState = {
  events: [],
  edms: [],
  edm: {},
  update_status: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        events: action.payload,
        loading: false
      };
    case GET_EDMS:
      return {
        ...state,
        edms: action.payload,
        loading: false
      };
    case GET_EDM:
      return {
        ...state,
        edm: action.payload,
        loading: false
      };
    case UPDATE_EDM:
      return {
        ...state,
        update_status: action.payload,
        loading: false
      };
    case DELETE_EDM:
      return {
        ...state,
        edms: state.edms.filter(edm => edm.id !== action.payload)
      };
    case EVENT_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
