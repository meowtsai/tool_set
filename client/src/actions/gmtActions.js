import axios from "axios";

import { GET_CSV, DATA_LOADING, GET_COMPLAINT } from "./types";

export const getCSV = url => dispatch => {
  dispatch(setDataLoading());
  console.log("url", url);
  axios
    .post("/api/g66_tool", url)
    .then(res =>
      dispatch({
        type: GET_CSV,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CSV,
        payload: ""
      })
    );
};

export const getH54Complaint = url => dispatch => {
  dispatch(setDataLoading());
  //console.log("url", url);
  axios
    .post("/api/gmt/get_complaint", url)
    .then(res => {
      //console.log("getH54Complaint data", res.data);
      dispatch({
        type: GET_COMPLAINT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_COMPLAINT,
        payload: ""
      })
    );
};

export const setDataLoading = () => dispatch =>
  dispatch({
    type: DATA_LOADING
  });
