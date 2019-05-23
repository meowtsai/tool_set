import React, { Component } from "react";

class ChannelItem extends Component {
  render() {
    const { channel_detail } = this.props;
    return (
      <div className="font-weight-light mt-2">
        <small>
          <div className="row">
            <div className="col-1">
              <img
                className="yt-avatar"
                width="25%"
                src={channel_detail.snippet.thumbnails.default.url}
                title={channel_detail.snippet.description}
              />{" "}
            </div>
            <div className="col-10">
              {parseInt(
                channel_detail.statistics.subscriberCount
              ).toLocaleString()}{" "}
              位訂閱者 <br />
              {parseInt(
                channel_detail.statistics.videoCount
              ).toLocaleString()}{" "}
              部影片{" "}
              <span className="badge badge-pill badge-warning ml-2">
                {channel_detail.snippet.country}
              </span>
            </div>
          </div>
        </small>
      </div>
    );
  }
}

export default ChannelItem;
