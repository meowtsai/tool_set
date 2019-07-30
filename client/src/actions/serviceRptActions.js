import axios from "axios";

import { GET_HOME_DATA, GET_CS_DATA } from "./types";

export const getHomeData = (begin_date, end_date, cs) => dispatch => {
  axios
    .get(
      `/api/service_rpt/home?begin_date=${begin_date}&end_date=${end_date}&cs=${cs}`
    )
    .then(res =>
      dispatch({
        type: GET_HOME_DATA,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_HOME_DATA,
        payload: {}
      })
    );
};
export const getCsMemebrs = () => dispatch => {
  axios
    .get("/api/service_rpt/cs_members")
    .then(res =>
      dispatch({
        type: GET_CS_DATA,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CS_DATA,
        payload: []
      })
    );
};
