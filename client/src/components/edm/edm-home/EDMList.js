import React, { Component } from "react";

import EDMItem from "./EDMItem";

class EDMList extends Component {
  render() {
    const { edms } = this.props;
    return (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">EDM 名稱</th>
            <th scope="col">活動代碼</th>
            <th scope="col">建立時間</th>
            <th scope="col">狀態</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          {edms && edms.map(edm => <EDMItem key={edm.id} edm={edm} />)}
        </tbody>
      </table>
    );
  }
}

export default EDMList;
