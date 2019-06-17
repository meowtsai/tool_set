import React, { Component } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import moment from "moment";
import "moment-timezone";
import InputGroup from "../../common/InputGroup";
import { getH54Complaint } from "../../../actions/gmtActions";
import CONFIG from "../../../actions/CONFIG";

class ComplaintReport extends Component {
  state = {
    url: CONFIG.h54_url_prefix + moment().format("YYYYMMDD") + ".log"
    //formated_data: []
  };
  onChange = e => {
    this.setState({ url: e.target.value.trim() });
  };
  onSubmit = e => {
    e.preventDefault();

    this.props.getH54Complaint({ url: this.state.url });
  };
  render() {
    const { complaint } = this.props.gmt;
    const { errors } = this.props;
    const c_servers = {
      11001: "11001 聖者廣者",
      11002: "11002 天涯海角"
    };
    const c_types = {
      1: "暱稱不雅",
      2: "言行不雅",
      3: "使用外掛",
      4: "線下交易",
      5: "涉嫌詐欺",
      6: "其他理由"
    };
    //const { formated_data } = this.state;
    let formated_data = [];
    let summary_data;
    if (complaint.length > 0) {
      var lines = complaint.split("\n");
      for (var line = 0; line < lines.length - 1; line++) {
        //find first comma to cut
        const item = lines[line];
        let str1 = item.slice(item.indexOf(",") + 1);
        //console.log(line);
        const objItem = JSON.parse(str1);
        //console.log(objItem);
        formated_data.push(objItem);
        //formated_data.push(objItem);
        //console.log(formated_data);
        // try {
        //   formated_data.push(JSON.parse(item.slice(item.indexOf(",") + 1)));
        // } catch (error) {
        //   console.error(error.message);
        // }
      }

      var summary = formated_data.reduce(function(prev, curr) {
        if (prev[curr.r_roleid]) {
          prev[curr.r_roleid].rpt_count = prev[curr.r_roleid].rpt_count + 1;
        } else {
          prev[curr.r_roleid] = {
            rpt_count: 1,
            r_name: curr.r_name.slice(
              curr.r_name.indexOf(">") + 1,
              curr.r_name.lastIndexOf("<")
            ),
            server: curr.server
          };
        }
        return prev;
      }, {});

      //console.log("summary", summary);

      summary_data = Object.keys(summary).map((obj, index) => {
        if (summary[obj].rpt_count > 5) {
          return (
            <div key={index} className="alert alert-danger small">
              {" "}
              {`[${c_servers[summary[obj].server]}] - ${
                summary[obj].r_name
              } ( ${obj} )  被舉報${summary[obj].rpt_count}次`}{" "}
            </div>
          );
        } else {
          return null;
        }
      });
    }

    //console.log(formated_data);

    let display_data = formated_data.map((ticket, index) => (
      <div className="card" key={ticket.report_time + index.toString()}>
        <div className="alert alert-warning small">
          [{c_servers[ticket.server]}] -{" "}
          {ticket.role_name.slice(
            ticket.role_name.indexOf(">") + 1,
            ticket.role_name.lastIndexOf("<")
          )}{" "}
          ({ticket.role_id}) 舉報{" "}
          <strong>
            {ticket.r_name.slice(
              ticket.r_name.indexOf(">") + 1,
              ticket.r_name.lastIndexOf("<")
            )}
            ({ticket.r_roleid}) : [{c_types[ticket.type]}]
            {ticket.reason ? ticket.reason : ""}
          </strong>
          <span className="mute" style={{ float: "left" }}>
            <Moment unix format="YYYY-MM-DD HH:mm:ss">
              {ticket.report_time - 8 * 60 * 60}
            </Moment>
          </span>
        </div>
        {/* <ul>
          <li>type: {ticket.type}</li>

          <li>vip_level: {ticket.vip_level}</li>

          <li>r_id: {ticket.r_id}</li>
          <li>r_roleid: {ticket.r_roleid}</li>
          <li>r_name: {ticket.r_name}</li>
          <li>r_vip_level: {ticket.r_vip_level}</li>
          <li>r_level: {ticket.r_level}</li>

          <li>mac_addr: {ticket.mac_addr}</li>
          <li>device_model: {ticket.device_model}</li>

          <li>role_id: {ticket.role_id}</li>

          <li>udid: {ticket.udid}</li>

          <li>gameid: {ticket.gameid}</li>
          <li>old_accountid: {ticket.old_accountid}</li>
          <li>role_level: {ticket.role_level}</li>
          <li>server: {ticket.server}</li>
          <li>app_channel: {ticket.app_channel}</li>
          <li>role_name: {ticket.role_name}</li>
          <li>reason: {ticket.reason}</li>
          <li>ip: {ticket.ip}</li>
          <li>account_id: {ticket.account_id}</li>
          <li>report_time: {ticket.report_time}</li>
        </ul> */}
      </div>
    ));

    // 10004 - 裁決之劍  哈蒂女戰士 580136 舉報  青衫丶策馬春秋 410142 [使用外掛]
    // # 31332 - 2019-06-13 19:51 (19 小時 前)

    return (
      <div>
        <h3 className="mt-4 mb-4">
          {" "}
          <span role="img" aria-label="complaint">
            😖
          </span>{" "}
          海島檢舉分析報表
        </h3>

        <p className="lead">輸入網址</p>
        <div className="row mb-4">
          <div className="col-md-12">
            <form onSubmit={this.onSubmit.bind(this)}>
              log 報表 的 URL:
              <InputGroup
                placeholder="* log 報表 的 URL"
                type="text"
                name="url"
                value={this.state.url}
                onChange={this.onChange.bind(this)}
                error={errors.url}
                info="輸入URL"
                icon="fas fa-globe"
              />
              <input type="submit" value="確定" className="btn btn-info" />
            </form>
          </div>
        </div>
        <div>{summary_data}</div>
        <div>{display_data}</div>
        <div />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  gmt: state.gmt,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getH54Complaint }
)(ComplaintReport);
