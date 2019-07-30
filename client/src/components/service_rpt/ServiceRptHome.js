import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { getHomeData, getCsMemebrs } from "../../actions/serviceRptActions";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import Summary from "./Summary";
import Spinner from "../common/Spinner";

const ServiceRptHome = ({ serviceRpt, getHomeData }) => {
  const { home, loading } = serviceRpt;
  //console.log("ServiceRptHome home", home.summary);
  const [begin_date, setBeginDate] = useState(
    moment()
      .subtract(7, "days")
      .format("YYYY-MM-DD")
  );
  const [end_date, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  useEffect(() => {
    getHomeData(begin_date, end_date, "");
  }, []);

  const onGetData = e => {
    //console.log("on get data");
    getHomeData(begin_date, end_date, "");
  };

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h3 className="mt-4 mb-4">★ 後送處理單統計 - 總覽頁面</h3>
      <div className="search_func">
        <p className="lead">選擇日期區間</p>
        <div className="row mb-4">
          <div className="col-md-3">
            <InputGroup
              placeholder="* 開始日期"
              type="date"
              name="begin_date"
              value={begin_date}
              onChange={e => {
                setBeginDate(e.target.value);
              }}
              error={""}
              info=" 起"
              icon="far fa-calendar-alt"
            />{" "}
          </div>
          <div className="col-md-3">
            <InputGroup
              placeholder="* 結束日期"
              type="date"
              name="end_date"
              value={end_date}
              onChange={e => {
                setEndDate(e.target.value);
              }}
              error={""}
              info=" 止"
              icon="far fa-calendar-alt"
            />
          </div>

          <div className="col-md-3">
            <button className="btn btn-primary" onClick={onGetData}>
              確定
            </button>
          </div>
        </div>
      </div>
      {home.summary &&
        home.summary.map((data, index) => (
          <Summary key={index} summary={data} />
        ))}
    </div>
  );
};

const mapStateToProps = state => ({
  serviceRpt: state.serviceRpt
});
export default connect(
  mapStateToProps,
  { getHomeData, getCsMemebrs }
)(ServiceRptHome);
