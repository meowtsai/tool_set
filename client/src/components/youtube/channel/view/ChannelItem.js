import React, { Component } from "react";
import Moment from "react-moment";
class ChannelItem extends Component {
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
            </a>
          </strong>{" "}
          <br /> ( 頻道 ID: {youtuber.id})
        </td>
        <td />

        <td>{parseInt(youtuber.subscriber_count).toLocaleString()}</td>
        <td>{parseInt(youtuber.video_count).toLocaleString()} </td>
        <td>{parseInt(youtuber.view_count).toLocaleString()}</td>
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
