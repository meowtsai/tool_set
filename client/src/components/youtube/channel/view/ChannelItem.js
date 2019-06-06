import React, { Component } from "react";
import Moment from "react-moment";
class ChannelItem extends Component {
  render() {
    const { youtuber } = this.props;
    return (
      <tr>
        <th scope="row" />
        <td>{youtuber.title}</td>
        <td>{youtuber.id}</td>

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
        <td>{youtuber.subscriber_count}</td>
        <td>{youtuber.video_count}</td>
        <td />
      </tr>
    );
  }
}

export default ChannelItem;
