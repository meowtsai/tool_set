import axios from "axios";

import {
  GET_EVENTS,
  GET_ERRORS,
  EVENT_LOADING,
  GET_EDMS,
  GET_EDM,
  DELETE_EDM,
  UPDATE_EDM
} from "./types";

//get all posts
//http://127.0.0.1:5000/api/edm/get_events
//{"status":1,"msg":[{"id":12,"game_id":"L20na","event_name":"逆水寒預註冊"},{"id":16,"game_id":"H54","event_name":"海島紀元預約登錄"}]}
export const getEvents = () => dispatch => {
  dispatch(setEventsLoading());
  axios
    .get("/api/edm/get_events")
    .then(res =>
      dispatch({
        type: GET_EVENTS,
        payload: res.data.msg
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EVENTS,
        payload: []
      })
    );
};
// /api/edm/get_edms
// 回傳所有edm項目
// {"status":1,"msg":[{"id":2,"event_id":16,"title":"test 123 new","create_time":"2019-04-23T05:38:30.000Z","status":"0"}]}
export const getEDMs = () => dispatch => {
  dispatch(setEventsLoading());
  axios
    .get("/api/edm/get_edms")
    .then(res =>
      dispatch({
        type: GET_EDMS,
        payload: res.data.msg
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EDMS,
        payload: []
      })
    );
};

//get EDM by its id
export const getEDM = edm_id => dispatch => {
  dispatch(setEventsLoading());
  axios
    .get(`/api/edm/get_edms/${edm_id}`)
    .then(res =>
      dispatch({
        type: GET_EDM,
        payload: res.data.msg
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EDM,
        payload: {}
      })
    );
};

export const createEDM = (edmData, history) => dispatch => {
  axios
    .post("/api/edm/create", edmData)
    .then(res => history.push("/edms"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const editEDM = (edm_id, edmData, history) => dispatch => {
  dispatch(setEventsLoading());
  axios
    .post(`/api/edm/modify/${edm_id}`, edmData)
    .then(res => {
      dispatch({
        type: UPDATE_EDM,
        payload: res.data
      });
      dispatch(getEDM(edm_id));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Delete account  & profile
export const deleteEDM = edm_id => dispatch => {
  if (window.confirm(`確定刪除編號 ${edm_id} 的EDM項目嗎?`)) {
    axios
      .delete(`/api/edm/delete/${edm_id}`)
      .then(res =>
        dispatch({
          type: DELETE_EDM,
          payload: edm_id
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};
export const setEventsLoading = () => dispatch =>
  dispatch({
    type: EVENT_LOADING
  });
