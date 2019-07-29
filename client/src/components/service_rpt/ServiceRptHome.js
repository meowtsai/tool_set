import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { getHomeData, getCsMemebrs } from "../../actions/serviceRptActions";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import Summary from "./Summary";
import Spinner from "../common/Spinner";

const ServiceRptHome = props => {
  const { home, loading, cs_members } = props.serviceRpt;
  //console.log("ServiceRptHome home", home);
  const [begin_date, setBeginDate] = useState(
    moment()
      .subtract(7, "days")
      .format("YYYY-MM-DD")
  );
  const [end_date, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [cs_member, setCsMember] = useState("");

  useEffect(() => {
    props.getHomeData(begin_date, end_date, cs_member);
    props.getCsMemebrs();
  }, []);

  const onGetData = e => {
    //console.log("on get data");
    props.getHomeData(begin_date, end_date, cs_member);
  };

  let options = [];
  if (cs_members.length > 0) {
    options = cs_members.map(cs_member => ({
      label: cs_member.name,
      value: cs_member.uid
    }));
  }

  options = [{ label: "** 不指定專員 **", value: "" }, ...options];

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
            <SelectListGroup
              placeholder="客服專員"
              name="cs_member"
              value={cs_member}
              onChange={e => {
                setCsMember(e.target.value);
              }}
              error={""}
              options={options}
              info="可指定客服專員查看"
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary" onClick={onGetData}>
              確定
            </button>
          </div>
        </div>
      </div>
      {home && <Summary summary={home.summary} />}
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
