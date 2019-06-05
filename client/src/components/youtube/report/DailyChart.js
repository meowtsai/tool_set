import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import "./../yt.css";
import SelectListGroup from "../../common/SelectListGroup";
import { getChartFiles, getChartData } from "../../../actions/youtubeActions";
import Spinner from "../../common/Spinner";
import { CSVLink } from "react-csv";
import isEmpty from "../../../validation/is-empty";
import CONFIG from "../../../actions/CONFIG";

class DailyChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game_name: "第五人格",
      report_day: "",
      sortyBy: "viewCount",
      asc: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.props.getChartFiles();
  }
  onSortClick(sortyBy) {
    this.setState({ sortyBy, asc: !this.state.asc });
  }
  onSubmit(e) {
    e.preventDefault();
    const filename = this.state.report_day;

    //console.log(game.game_id);
    this.props.getChartData(filename);
  }
  onChange(e) {
    //console.log(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { chart_filenames, loading, chart_data } = this.props.youtube;
    const { sortyBy, asc, game_name, yyyymm } = this.state;
    const fileName = `chart_games_${yyyymm}`;

    const errors = this.props.errors.errors;
    const csvHeaders = [
      { label: "#", key: "rank" },
      { label: "影片名稱", key: "title" },

      { label: "長度", key: "duration" },
      { label: "觀看數", key: "viewCount" },
      { label: "喜歡", key: "likeCount" },
      { label: "不喜歡", key: "dislikeCount" },
      { label: "留言", key: "commentCount" },
      { label: "頻道", key: "channelTitle" },
      { label: "發布日期", key: "publishedAt" },
      { label: "影片網址", key: "url" },
      { label: "頻道網址", key: "Youtuber" }
    ];

    let report_day_options = chart_filenames
      ? chart_filenames.map(file => ({
          label: file.replace(".json", ""),
          key: file.replace(".json", "")
        }))
      : [];

    report_day_options.unshift({ label: "請選擇", key: "" });
    //console.log("report_day_options", report_day_options);
    if (sortyBy !== "") {
      let scending = asc ? 1 : -1;

      chart_data.sort((a, b) => {
        if (sortyBy === "viewCount") {
          if (
            parseInt(a["statistics"][sortyBy]) <
            parseInt(b["statistics"][sortyBy])
          ) {
            return -1 * scending;
          }
          if (
            parseInt(a["statistics"][sortyBy]) >
            parseInt(b["statistics"][sortyBy])
          ) {
            return 1 * scending;
          }
        } else {
          if (a["snippet"][sortyBy] < b["snippet"][sortyBy]) {
            return -1 * scending;
          }
          if (a["snippet"][sortyBy] > b["snippet"][sortyBy]) {
            return 1 * scending;
          }
        }
      });
      //console.log("yt_reports", yt_reports);
    }
    return (
      <div className="container">
        <h3 className="mt-4 mb-4">Youtube 熱門遊戲日報表</h3>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <p className="lead">選擇想查看的報表日期</p>
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
                    placeholder="日期"
                    name="report_day"
                    value={this.state.report_day}
                    onChange={this.onChange}
                    error={errors.report_day}
                    options={report_day_options}
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
                      <th scope="col">#</th>
                      <th scope="col">影片名稱</th>
                      <th scope="col">
                        <a
                          onClick={this.onSortClick.bind(this, "viewCount")}
                          style={{ cursor: "pointer" }}
                        >
                          觀看數{" "}
                          {sortyBy === "viewCount" ? (asc ? "↑" : "↓") : ""}
                        </a>
                      </th>
                      <th scope="col">
                        <a
                          onClick={this.onSortClick.bind(this, "channelId")}
                          style={{ cursor: "pointer" }}
                        >
                          youtuber{" "}
                          {sortyBy === "channelId" ? (asc ? "↑" : "↓") : ""}
                        </a>
                      </th>
                      <th scope="col">
                        <a
                          onClick={this.onSortClick.bind(this, "publishedAt")}
                          style={{ cursor: "pointer" }}
                        >
                          發佈於{" "}
                          {sortyBy === "publishedAt" ? (asc ? "↑" : "↓") : ""}
                        </a>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {chart_data &&
                      chart_data
                        .filter(item => item.snippet.categoryId === "20")
                        .map((item, index) => (
                          <tr key={item.channelId}>
                            <th scope="row">{index + 1}</th>
                            <td className="text-left">{item.snippet.title}</td>
                            <td className="text-right">
                              {parseInt(
                                item.statistics.viewCount
                              ).toLocaleString()}
                            </td>
                            <th scope="row">{item.snippet.channelTitle}</th>

                            <td>
                              {moment(item.snippet.publishedAt).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="6">
                        {chart_data.length < 0 && (
                          <CSVLink
                            data={chart_data}
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

DailyChart.propTypes = {
  getChartFiles: PropTypes.func.isRequired,
  getChartData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  youtube: state.youtube
});
export default connect(
  mapStateToProps,
  { getChartFiles, getChartData }
)(DailyChart);
