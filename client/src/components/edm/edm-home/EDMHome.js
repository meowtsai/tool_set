import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import Spinner from "../../common/Spinner";
import { getEDMs } from "../../../actions/edmActions";

import EDMList from "./EDMList";

class EDMHome extends Component {
  componentDidMount() {
    this.props.getEDMs();
  }
  render() {
    const { edms, loading } = this.props.edms;
    let edmListContent;
    if (loading) {
      edmListContent = <Spinner />;
    } else {
      edmListContent = <EDMList edms={edms} />;
    }
    return (
      <div className="container">
        <h3 className="mt-4 mb-4">EDM 列表</h3>
        <div className="row mb-4">
          <div className="col">
            <Link to="edms/create-edm" className="btn btn-md btn-info">
              新增EDM項目
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col">{edmListContent}</div>
        </div>
      </div>
    );
  }
}

EDMHome.propTypes = {
  getEDMs: PropTypes.func.isRequired,
  edms: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  edms: state.edms
});
export default connect(
  mapStateToProps,
  { getEDMs }
)(EDMHome);
