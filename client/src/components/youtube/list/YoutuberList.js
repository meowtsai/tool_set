import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../../common/Spinner";
import { getYoutubers } from "../../../actions/youtubeActions";

import YoutuList from "./EDMList";

class YoutuberList extends Component {
  componentDidMount() {
    this.props.getYoutubers();
  }
  render() {
    const { youtubers, loading } = this.props.youtube;
    let yListContent;
    if (loading) {
      yListContent = <Spinner />;
    } else {
      yListContent = (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">名稱</th>
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
    return (
      <div className="container">
        <h3 className="mt-4 mb-4">Youtuber 列表</h3>
        <div className="row mb-4">
          <div className="col">
            <Link to="youtuber/create-youtuber" className="btn btn-md btn-info">
              新增Youtuber項目
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col">{yListContent}</div>
        </div>
      </div>
    );
  }
}

YoutuberList.propTypes = {
  getYoutubers: PropTypes.func.isRequired,
  youtube: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  youtube: state.youtube
});
export default connect(
  mapStateToProps,
  { getYoutubers }
)(YoutuberList);
