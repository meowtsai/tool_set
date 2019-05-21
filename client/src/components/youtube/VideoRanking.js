import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

import SelectListGroup from "../common/SelectListGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import InputGroup from "../common/InputGroup";
import { getRankinglist } from "../../actions/youtubeActions";
import Spinner from "../common/Spinner";
import VideoList from "./VideoList";
import isEmpty from "../../validation/is-empty";
class VideoRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game_name: "第五人格",
      sort_by: "viewCount",
      keyword: "",
      channelId: "",
      channelTitle: "",
      begin_time: moment(
        moment()
          .subtract(7, "days")
          .calendar()
      ).format("YYYY-MM-DDTHH:mm"),
      end_time: moment(moment().subtract(1, "days")).format("YYYY-MM-DDT23:59"),
      errors: {},
      nextPageToken: "",
      prevPageToken: "",
      pageNumber: 1
    };
    //begin_time: moment(edm.begin_time).format("YYYY-MM-DDTHH:mm") //2019-04-24T14:00
    //moment().subtract(10, 'days').calendar();

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.copyToInput = this.copyToInput.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getPrevPage = this.getPrevPage.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    let pageObject = { nextPageToken: "", prevPageToken: "" };
    if (nextProps.youtube.ranking_list.nextPageToken) {
      pageObject = {
        nextPageToken: nextProps.youtube.ranking_list.nextPageToken
      };
    }
    if (nextProps.youtube.ranking_list.prevPageToken) {
      pageObject = {
        ...pageObject,
        prevPageToken: nextProps.youtube.ranking_list.prevPageToken
      };
    }

    //console.log("componentWillReceiveProps", pageObject);

    this.setState({ ...pageObject });
  }

  copyToInput(id, title) {
    this.setState({ channelId: id, channelTitle: title });
  }

  getNextPage() {
    this.setState({ pageNumber: this.state.pageNumber + 1 });
    this.submitForm(this.state.nextPageToken);
  }

  getPrevPage() {
    this.setState({ pageNumber: this.state.pageNumber - 1 });
    this.submitForm(this.state.prevPageToken);
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ pageNumber: 1 });
    this.submitForm("");
  }

  submitForm(pageToken) {
    let searchObject = {
      game_name: this.state.game_name,
      sort_by: this.state.sort_by,
      keyword: this.state.keyword,
      channelId: this.state.channelId,
      begin_time: moment(this.state.begin_time).format("YYYY-MM-DDTHH:mm:ss"), //2019-04-24T14:00
      end_time: moment(this.state.end_time).format("YYYY-MM-DDTHH:mm:ss"), //2019-04-24T14:00
      pageToken: pageToken
    };
    this.props.getRankinglist(searchObject);
  }

  onChange(e) {
    this.setState({ errors: "" });

    if (
      e.target.name === "end_time" &&
      this.state.begin_time > e.target.value
    ) {
      this.setState({
        errors: { end_time: "結束日期必須大於起始日期" }
      });
    }
    if (
      e.target.name === "begin_time" &&
      this.state.end_time < e.target.value
    ) {
      this.setState({
        errors: { begin_time: "開始日期必須大於結束日期" }
      });
    }
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { ranking_list, loading } = this.props.youtube;
    const {
      errors,
      game_name,
      sort_by,
      channelTitle,
      begin_time,
      end_time
    } = this.state;
    const fileName =
      game_name +
      channelTitle +
      begin_time +
      end_time +
      moment().format("YYYYMMDD");
    //console.log(this.state);
    let options = [
      { label: "第五人格", value: "第五人格" },
      { label: "明日之後", value: "明日之後" },
      { label: "決戰平安京", value: "決戰平安京" },
      { label: "光明之戰", value: "光明之戰" },
      { label: "權力與紛爭", value: "權力與紛爭" },
      { label: "荒野行動", value: "荒野行動" },
      { label: "遇見逆水寒", value: "遇見逆水寒" }
    ];
    let sortByOptions = [
      { label: "觀看數", value: "viewCount" },
      { label: "發佈日期", value: "date" },
      { label: "評價", value: "rating" }
    ];

    return (
      <div className="container">
        <h3 className="mt-4 mb-4">熱門 Youtube 影片</h3>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <p className="lead">輸入以下資料</p>
            <div className="row mb-4">
              <div className="col-md-8">
                <form onSubmit={this.onSubmit} className="form-inline">
                  <SelectListGroup
                    placeholder="遊戲"
                    name="game_name"
                    value={this.state.game_name}
                    onChange={this.onChange}
                    error={errors.game_name}
                    options={options}
                    info=""
                  />
                  <SelectListGroup
                    placeholder="排序"
                    name="sort_by"
                    value={this.state.sort_by}
                    onChange={this.onChange}
                    error={errors.sort_by}
                    options={sortByOptions}
                    info=""
                  />
                  <TextFieldGroup
                    placeholder="* 關鍵字"
                    name="keyword"
                    value={this.state.keyword}
                    onChange={this.onChange}
                    error={errors.keyword}
                    info=""
                  />
                  <TextFieldGroup
                    placeholder="* 頻道ID"
                    name="channelId"
                    value={this.state.channelId}
                    onChange={this.onChange}
                    error={errors.channelId}
                    info={this.state.channelTitle}
                  />
                  <InputGroup
                    placeholder="* 開始日期"
                    type="datetime-local"
                    name="begin_time"
                    value={this.state.begin_time}
                    onChange={this.onChange}
                    error={errors.begin_time}
                    info=" 起"
                    icon="far fa-calendar-alt"
                  />{" "}
                  ~
                  <InputGroup
                    placeholder="* 結束日期"
                    type="datetime-local"
                    name="end_time"
                    value={this.state.end_time}
                    onChange={this.onChange}
                    error={errors.end_time}
                    info=" 止"
                    icon="far fa-calendar-alt"
                  />
                  <input
                    type="submit"
                    value="確定"
                    className="btn btn-info ml-2"
                    disabled={!isEmpty(errors)}
                  />
                  {this.state.prevPageToken !== "" && (
                    <button
                      type="button"
                      className="btn btn-warning ml-2"
                      onClick={this.getPrevPage}
                      disabled={!isEmpty(errors)}
                    >
                      上一頁
                    </button>
                  )}
                  {this.state.nextPageToken !== "" && (
                    <button
                      type="button"
                      className="btn btn-warning ml-2"
                      onClick={this.getNextPage}
                      disabled={!isEmpty(errors)}
                    >
                      下一頁
                    </button>
                  )}
                </form>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-12">
                <VideoList
                  videos={ranking_list.items}
                  copyToInput={this.copyToInput}
                  page={this.state.pageNumber}
                  fileName={fileName}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

VideoRanking.propTypes = {
  getRankinglist: PropTypes.func.isRequired,
  youtube: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  youtube: state.youtube
});
export default connect(
  mapStateToProps,
  { getRankinglist }
)(VideoRanking);
