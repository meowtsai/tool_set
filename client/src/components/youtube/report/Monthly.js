import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import "./../yt.css";
import SelectListGroup from "../../common/SelectListGroup";
import { getYtReports } from "../../../actions/youtubeActions";
import Spinner from "../../common/Spinner";
import { CSVLink } from "react-csv";
import isEmpty from "../../../validation/is-empty";
import CONFIG from "../../../actions/CONFIG";

class Monthly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game_name: "第五人格",
      yyyymm: "2019-05",
      sortyBy: "view_count",
      asc: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSortClick(sortyBy) {
    this.setState({ sortyBy, asc: !this.state.asc });
  }
  //   begin_time: moment(
  //     moment()
  //       .subtract(7, "days")
  //       .calendar()
  //   ).format("YYYY-MM-DDTHH:mm"),
  //   end_time: moment(moment().subtract(1, "days")).format("YYYY-MM-DDT23:59"),
  onSubmit(e) {
    e.preventDefault();
    let searchObject = {
      game_name: this.state.game_name,
      begin_date: moment(`${this.state.yyyymm}-01T00:00:00`).format(
        "YYYY-MM-DDTHH:mm:ss"
      ), //2019-04-24T14:00
      end_date: moment(`${this.state.yyyymm}-31T23:59:59`).format(
        "YYYY-MM-DDTHH:mm:ss"
      ) //2019-04-24T14:00
    };
    //console.log(this.state.yyyymm);
    //console.log(searchObject);
    const game = CONFIG.GameOptions.filter(
      game => game.value === this.state.game_name
    )[0];

    //console.log(game.game_id);
    this.props.getYtReports(game.game_id, searchObject);
  }
  onChange(e) {
    //console.log(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { yt_reports, loading } = this.props.youtube;
    const { sortyBy, asc, game_name, yyyymm } = this.state;
    const fileName = `${game_name}${yyyymm}`;
    // console.log("sortyBy", sortyBy);
    // console.log("asc", asc);
    const errors = this.props.errors.errors;
    const csvHeaders = [
      { label: "遊戲名稱", key: "game_name" },
      { label: "頻道主", key: "title" },
      { label: "影片數", key: "video_count" },
      { label: "觀看數", key: "view_count" },
      { label: "喜歡", key: "like_count" },
      { label: "不喜歡", key: "dislike_count" }
    ];
    let options = CONFIG.GameOptions;
    let yy_options = [
      { label: "2019-05", value: "2019-05" },
      { label: "2019-04", value: "2019-04" },
      { label: "2019-03", value: "2019-03" },
      { label: "2019-02", value: "2019-02" },
      { label: "2019-01", value: "2019-01" }
    ];
    if (sortyBy !== "") {
      let scending = asc ? 1 : -1;

      yt_reports.sort((a, b) => {
        if (sortyBy === "view_count" || sortyBy === "video_count") {
          if (parseInt(a[sortyBy]) < parseInt(b[sortyBy])) {
            return -1 * scending;
          }
          if (parseInt(a[sortyBy]) > parseInt(b[sortyBy])) {
            return 1 * scending;
          }
        } else {
          if (a[sortyBy] < b[sortyBy]) {
            return -1 * scending;
          }
          if (a[sortyBy] > b[sortyBy]) {
            return 1 * scending;
          }
        }
      });
      console.log("yt_reports", yt_reports);
    }
    return (
      <div className="container">
        <h3 className="mt-4 mb-4">Youtuber 月報表</h3>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <p className="lead">輸入以下資料</p>
            <div className="row mb-4">
              <div className="col-md-8">
                <form onSubmit={this.onSubmit} className="form-inline">
                  {/* <SelectListGroup
                    placeholder="遊戲"
                    name="game_name"
                    value={this.state.game_name}
                    onChange={this.onChange}
                    error={errors.game_name}
                    options={options}
                    info=""
                  /> */}

                  <SelectListGroup
                    placeholder="月份"
                    name="yyyymm"
                    value={this.state.yyyymm}
                    onChange={this.onChange}
                    error={errors.yyyymm}
                    options={yy_options}
                    info=""
                  />

                  <input
                    type="submit"
                    value="確定"
                    className="btn btn-info ml-2"
                    disabled={!isEmpty(errors)}
                  />
                </form>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-12">
                <table className="table table-bordered small">
                  <thead>
                    <tr>
                      <th scope="col">
                        <a
                          onClick={this.onSortClick.bind(this, "game_name")}
                          style={{ cursor: "pointer" }}
                        >
                          遊戲名稱{" "}
                          {sortyBy === "game_name" ? (asc ? "↑" : "↓") : ""}
                        </a>
                      </th>
                      <th scope="col">
                        <a
                          onClick={this.onSortClick.bind(this, "title")}
                          style={{ cursor: "pointer" }}
                        >
                          Youtuber{" "}
                          {sortyBy === "title" ? (asc ? "↑" : "↓") : ""}
                        </a>
                      </th>
                      <th scope="col">
                        <a
                          onClick={this.onSortClick.bind(this, "video_count")}
                          style={{ cursor: "pointer" }}
                        >
                          影片數{" "}
                          {sortyBy === "video_count" ? (asc ? "↑" : "↓") : ""}
                        </a>
                      </th>
                      <th scope="col">
                        {" "}
                        <a
                          onClick={this.onSortClick.bind(this, "view_count")}
                          style={{ cursor: "pointer" }}
                        >
                          觀看數{" "}
                          {sortyBy === "view_count" ? (asc ? "↑" : "↓") : ""}
                        </a>
                      </th>
                      <th scope="col">
                        <i
                          className="far fa-thumbs-up ml-3 mr-1"
                          style={{ color: "#007bff" }}
                        />
                        喜歡
                      </th>
                      <th scope="col">
                        <i
                          className="far fa-thumbs-down ml-3 mr-1"
                          style={{ color: "#dc3545" }}
                        />
                        不喜歡
                      </th>
                      <th scope="col">
                        <i
                          className="far fa-comment  ml-3 mr-1"
                          style={{ color: "#6c757d" }}
                        />
                        留言
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {yt_reports &&
                      yt_reports.map(item => (
                        <tr key={item.channelId}>
                          <td className="text-center">{item.game_name}</td>
                          <td className="text-center">{item.title}</td>
                          <td className="text-right">
                            {parseInt(item.video_count).toLocaleString()}
                          </td>
                          <td className="text-right">
                            {parseInt(item.view_count).toLocaleString()}
                          </td>
                          <td className="text-right">
                            {parseInt(item.like_count).toLocaleString()}
                          </td>
                          <td className="text-right">
                            {parseInt(item.dislike_count).toLocaleString()}
                          </td>
                          <td className="text-right">
                            {parseInt(item.comment_count).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="6">
                        {yt_reports.length > 0 && (
                          <CSVLink
                            data={yt_reports}
                            headers={csvHeaders}
                            filename={fileName + ".csv"}
                          >
                            下載 csv檔案
                          </CSVLink>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

Monthly.propTypes = {
  getYtReports: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  youtube: state.youtube
});
export default connect(
  mapStateToProps,
  { getYtReports }
)(Monthly);
