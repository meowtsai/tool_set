import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import edmReducer from "./edmReducer";
import gmtReducer from "./gmtReducer";
import youtubeReducer from "./youtubeReducer";
import serviceRptReducer from "./serviceRptReducer";
import authReducer from "./authReducer";

export default combineReducers({
  errors: errorReducer,
  edms: edmReducer,
  gmt: gmtReducer,
  youtube: youtubeReducer,
  serviceRpt: serviceRptReducer,
  auth: authReducer
});
