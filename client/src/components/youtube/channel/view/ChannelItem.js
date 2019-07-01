import React, { Component } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { followChannel } from "../../../../actions/youtubeActions";

class ChannelItem extends Component {
  onFollowAction(channel_data) {
    console.log("channel_data", channel_data);
    this.props.followChannel(channel_data);
  }
  render() {
    const { youtuber } = this.props;
    return (
      <tr>
        <td>
          <img
            className="mr-2"
            src={youtuber.thumbnails}
            style={{ borderRadius: "50%", width: "10%" }}
          />
          <strong>
            <a
              href={`https://www.youtube.com/channel/${youtuber.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {youtuber.title}
            </a>{" "}
          </strong>{" "}
          <br /> ( 頻道 ID: {youtuber.id})
        </td>
        <td>{youtuber.games_group}</td>

        <td>
          <i className="fas fa-user-friends text-info mr-3" />
          {parseInt(youtuber.subscriber_count).toLocaleString()} <br />
          <i className="fas fa-film text-info mr-3" />
          {parseInt(youtuber.video_count).toLocaleString()}
          <br />
          <i className="fas fa-eye text-info mr-3" />
          {parseInt(youtuber.view_count).toLocaleString()}
          <br />
        </td>

        <td>
          {" "}
          <Moment format="YYYY-MM-DD HH:mm:ss">
            {youtuber.published_at}
          </Moment>{" "}
        </td>
        <td>
          {" "}
          <Moment format="YYYY-MM-DD HH:mm:ss">
            {youtuber.update_time}
          </Moment>{" "}
        </td>

        <td>
          <button
            type="button"
            onClick={this.onFollowAction.bind(this, {
              id: youtuber.id,
              action: !youtuber.following
            })}
            className={`btn ${
              youtuber.following ? "btn-danger" : "btn-secondary"
            } btn-sm`}
          >
            {youtuber.following ? (
              <i className="fas fa-minus" />
            ) : (
              <i className="fas fa-plus" />
            )}
          </button>
          <Link
            to={`/youtube/channel/edit-channel/${youtuber.id}`}
            className="btn btn-primary btn-sm ml-2"
          >
            <i className="fas fa-edit" />
          </Link>
        </td>
      </tr>
    );
  }
}

ChannelItem.propTypes = {
  followChannel: PropTypes.func.isRequired
};

export default connect(
  null,
  { followChannel }
)(ChannelItem);
