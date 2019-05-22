import React, { Component } from "react";

class ChannelItem extends Component {
  render() {
    const { channel_detail } = this.props;
    return (
      <div className="font-weight-light mt-2">
        <small>
          <img
            width="25%"
            src={channel_detail.snippet.thumbnails.default.url}
            title={channel_detail.snippet.description}
          />
          <br />
          {parseInt(
            channel_detail.statistics.subscriberCount
          ).toLocaleString()}{" "}
          位訂閱者 <br />
          {parseInt(channel_detail.statistics.videoCount).toLocaleString()}{" "}
          部影片
        </small>
      </div>
    );
  }
}

export default ChannelItem;
