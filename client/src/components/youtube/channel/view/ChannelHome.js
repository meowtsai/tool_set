import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import Spinner from "../../../common/Spinner";
import {
  getYoutubers,
  followChannel
} from "../../../../actions/youtubeActions";
import ChannelList from "./ChannelList";

class ChannelHome extends Component {
  componentDidMount() {
    this.props.getYoutubers();
  }

  render() {
    const { youtubers, loading } = this.props.youtube;
    //console.log(this.props);
    let chListContent;
    if (loading) {
      chListContent = <Spinner />;
    } else {
      chListContent = <ChannelList youtubers={youtubers} />;
    }
    return (
      <div className="container">
        <h3 className="mt-4 mb-4">關注頻道列表</h3>
        <div className="row mb-4">
          <div className="col">
            <Link
              to="/youtube/channel/create-channel"
              className="btn btn-md btn-info"
            >
              新增頻道
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col">{chListContent}</div>
        </div>
      </div>
    );
  }
}

ChannelHome.propTypes = {
  getYoutubers: PropTypes.func.isRequired,
  youtube: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  youtube: state.youtube
});
export default connect(
  mapStateToProps,
  { getYoutubers, followChannel }
)(ChannelHome);
