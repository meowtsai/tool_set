import React, { Component } from "react";

import ChannelItem from "./ChannelItem";

class ChannelList extends Component {
  render() {
    const { youtubers } = this.props;
    console.log("youtubers");
    return (
      <table className="table table-bordered small">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">名稱</th>
            <th scope="col">代碼</th>
            <th scope="col">建立時間</th>
            <th scope="col">更新時間</th>
            <th scope="col">訂閱數 </th>
            <th scope="col">影片數 </th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          {youtubers &&
            youtubers.map(youtuber => (
              <ChannelItem key={youtuber.id} youtuber={youtuber} />
            ))}
        </tbody>
      </table>
    );
  }
}

export default ChannelList;
