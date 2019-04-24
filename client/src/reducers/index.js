import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import edmReducer from "./edmReducer";
export default combineReducers({
  errors: errorReducer,
  edms: edmReducer
});
