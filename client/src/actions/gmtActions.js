import axios from "axios";

import { GET_CSV, DATA_LOADING } from "./types";

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

export const setDataLoading = () => dispatch =>
  dispatch({
    type: DATA_LOADING
  });
