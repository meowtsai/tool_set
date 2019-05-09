import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import SelectListGroup from "../common/SelectListGroup";
import InputGroup from "../common/InputGroup";
import { getRankinglist } from "../../actions/youtubeActions";
import Spinner from "../common/Spinner";
import VideoList from "./VideoList";
class VideoRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game_name: "第五人格",
      begin_time: moment(
        moment()
          .subtract(7, "days")
          .calendar()
      ).format("YYYY-MM-DDTHH:mm"),
      end_time: moment(moment().subtract(1, "days")).format("YYYY-MM-DDT23:59")
    };
    //begin_time: moment(edm.begin_time).format("YYYY-MM-DDTHH:mm") //2019-04-24T14:00
    //moment().subtract(10, 'days').calendar();

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {}

  onSubmit(e) {
    e.preventDefault();
    //console.log("submit");
    let searchObject = {
      game_name: this.state.game_name,
      begin_time: moment(this.state.begin_time).format("YYYY-MM-DDTHH:mm:ss"), //2019-04-24T14:00
      end_time: moment(this.state.end_time).format("YYYY-MM-DDTHH:mm:ss") //2019-04-24T14:00
    };

    this.props.getRankinglist(searchObject);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { ranking_list, loading } = this.props.youtube;
    const { errors } = this.props;
    let options = [
      { label: "第五人格", value: "第五人格" },
      { label: "決戰平安京", value: "決戰平安京" },
      { label: "光明之戰", value: "光明之戰" },
      { label: "權力與紛爭", value: "權力與紛爭" },
      { label: "荒野行動", value: "荒野行動" },
      { label: "遇見逆水寒", value: "遇見逆水寒" }
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
                <form onSubmit={this.onSubmit}>
                  <SelectListGroup
                    placeholder="遊戲"
                    name="game_name"
                    value={this.state.game_name}
                    onChange={this.onChange}
                    error={errors.game_name}
                    options={options}
                    info="選擇要搜尋的遊戲名稱"
                  />
                  <InputGroup
                    placeholder="* 開始日期"
                    type="datetime-local"
                    name="begin_time"
                    value={this.state.begin_time}
                    onChange={this.onChange}
                    error={errors.begin_time}
                    info="輸入影片發布日期開始範圍"
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
                    info="輸入影片發布日期結束範圍"
                    icon="far fa-calendar-alt"
                  />
                  <input type="submit" value="確定" className="btn btn-info" />
                </form>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-12">
                <VideoList videos={ranking_list.items} />
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
