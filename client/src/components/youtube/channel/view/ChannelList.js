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
            <th scope="col">名稱</th>
            <th scope="col">遊戲</th>
            <th scope="col">
              <i class="fas fa-user-friends text-info mr-3" />
              訂閱數{" "}
            </th>
            <th scope="col">
              <i className="fas fa-film text-info mr-3" />
              影片數{" "}
            </th>
            <th scope="col">
              <i className="fas fa-eye text-info mr-3" />
              觀看數{" "}
            </th>
            <th scope="col">頻道建立@</th>
            <th scope="col">資料更新時間</th>

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
