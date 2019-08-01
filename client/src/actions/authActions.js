import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SET_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  CLEAR_ERRORS,
  LOGOUT
} from "./types";

// Get techs from server
export const login = user => async dispatch => {
  dispatch(setLoading());
  dispatch(clearErrors());
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  axios
    .post("/api/auth", user, config)
    .then(res => {
      //localStorage.setItem("jwtToken", res.data.msg.token);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: LOGIN_ERROR,
        payload: err.response.data.msg
      });
    });
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

// Set loading to true
export const setLoading = () => {
  return {
    type: SET_LOADING
  };
};
