import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import CONFIG from "../../../../actions/CONFIG";
import { getYoutuber, modifyChannel } from "../../../../actions/youtubeActions";

//import isEmpty from "../../../../validation/is-empty";
class EditChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games_group: "",
      errors: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.youtuber) {
      this.setState({ games_group: nextProps.youtuber.games_group });
    }
  }

  componentDidMount() {
    if (this.props.match.params.yt_id) {
      this.props.getYoutuber(this.props.match.params.yt_id);
    }
  }

  onSubmit(e) {
    e.preventDefault();
    //console.log("submit");
    const channelData = {
      id: this.props.youtuber.id,
      games_group: this.state.games_group
    };
    //console.log(channelData);
    this.props.modifyChannel(channelData, this.props.history);
  }

  onChange(e) {
    //this.setState({ [e.target.name]: e.target.value });
    const selGame = e.target.value;
    //console.log(" this.state.games_group", this.state.games_group);
    let selGames = this.state.games_group.split(",");

    if (this.state.games_group.indexOf(selGame) > -1) {
      selGames = selGames.filter(game => game !== selGame);
      //console.log("selGames", selGames);
    } else {
      selGames.push(selGame);
    }

    this.setState({
      games_group: selGames.length > 0 ? selGames.join(",") : ""
    });
  }

  render() {
    const { youtuber } = this.props;
    const { errors, games_group } = this.state;

    let options = CONFIG.GameOptions;
    // let options = [
    //   { label: "超機動聯盟", value: "超機動聯盟", game_id: "G93" },
    //   { label: "第五人格", value: "第五人格", game_id: "h55naxx2tw" },
    //   { label: "明日之後", value: "明日之後", game_id: "g66naxx2tw" },
    //   { label: "決戰平安京", value: "決戰平安京", game_id: "g78naxx2hmt" },
    //   { label: "權力與紛爭", value: "權力與紛爭", game_id: "LRE" },
    //   { label: "荒野行動", value: "荒野行動", game_id: "g83tw" }
    // ];

    return (
      <div className="container">
        <h3 className="mt-4 mb-4"> 修改頻道</h3>
        {errors && <div className="alert alert-danger">{errors}</div>}

        <p className="lead">輸入以下資料</p>
        <div className="row mb-4">
          <div className="col-md-8">
            <div>
              {" "}
              頻道名稱: {youtuber.title}{" "}
              <img
                alt={youtuber.title}
                className="mr-2"
                src={youtuber.thumbnails}
                style={{ borderRadius: "50%", width: "10%" }}
              />
            </div>
            <div> 頻道ID: {youtuber.id} </div>
            <hr />

            <form onSubmit={this.onSubmit}>
              請勾選相關遊戲
              <div className="m-3">
                {options.map(game => (
                  <div
                    className="form-check form-check-inline"
                    key={game.game_id}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`chk${game.game_id}`}
                      value={game.game_id}
                      onChange={this.onChange}
                      checked={
                        games_group && games_group.indexOf(game.game_id) > -1
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="inlineCheckbox1"
                    >
                      {game.label}
                    </label>
                  </div>
                ))}
              </div>
              <input type="submit" value="確定" className="btn btn-info" />
              <Link
                to="/youtube/channel/list"
                className="btn btn-secondary ml-2"
              >
                取消
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

EditChannel.propTypes = {
  getYoutuber: PropTypes.func.isRequired,
  modifyChannel: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  youtuber: state.youtube.youtuber
});
export default connect(
  mapStateToProps,
  { getYoutuber, modifyChannel }
)(EditChannel);
