import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import edmReducer from "./edmReducer";
import gmtReducer from "./gmtReducer";
export default combineReducers({
  errors: errorReducer,
  edms: edmReducer,
  gmt: gmtReducer
});
