import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import edmReducer from "./edmReducer";
import gmtReducer from "./gmtReducer";
import youtubeReducer from "./youtubeReducer";
export default combineReducers({
  errors: errorReducer,
  edms: edmReducer,
  gmt: gmtReducer,
  youtube: youtubeReducer
});
