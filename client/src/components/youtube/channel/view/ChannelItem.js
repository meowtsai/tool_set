import React, { Component } from "react";
import Moment from "react-moment";
class ChannelItem extends Component {
  render() {
    const { youtuber } = this.props;
    return (
      <tr>
        <td>
          <strong>{youtuber.title}</strong> <br /> ( 頻道 ID: {youtuber.id})
        </td>
        <td>
          <img
            src={youtuber.thumbnails}
            style={{ borderRadius: "50%", width: "50%" }}
          />
        </td>
        <td>{youtuber.subscriber_count}</td>
        <td>{youtuber.video_count}</td>
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

        <td />
      </tr>
    );
  }
}

export default ChannelItem;
