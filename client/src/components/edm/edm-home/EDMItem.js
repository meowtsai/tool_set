import React, { Component } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { deleteEDM } from "../../../actions/edmActions";

class EDMItem extends Component {
  state = {
    status_checked: false,
    status_text: "初始",
    switch_disabled: false
  };

  componentDidMount() {
    console.log("this.props", this.props.edm);

    switch (this.props.edm.status) {
      case "1":
        this.setState({ status_checked: true, status_text: "已經開始" });
        break;
      case "2":
        this.setState({ status_checked: false, status_text: "暫停" });
        break;
      case "4":
        this.setState({ switch_disabled: true, status_text: "結束" });
        break;
      default:
        break;
    }
  }
  onDeleteClick = edm_id => {
    console.log("edm_id", edm_id);
    this.props.deleteEDM(edm_id);
  };
  onChange = e => {
    console.log("e", e.target.checked);
    this.setState({ status_checked: e.target.checked });
  };
  render() {
    const { edm } = this.props;
    const { status_checked, status_text, switch_disabled } = this.state;

    return (
      <tr>
        <th scope="row">{edm.id}</th>
        <td>{edm.title}</td>
        <td>{edm.event_id}</td>
        <td>
          <Moment format="YYYY-MM-DD HH:mm:ss">{edm.create_time}</Moment>
        </td>
        <td>
          <small>{`總數: ${edm.total_user}/發送中: ${edm.sending}/已發送: ${
            edm.sent
          }`}</small>
          <div className="custom-control custom-switch">
            <input
              type="checkbox"
              className="custom-control-input"
              id="status_switch"
              onChange={this.onChange.bind(this)}
              checked={status_checked}
              disabled={switch_disabled}
            />
            <label className="custom-control-label" htmlFor="status_switch">
              {status_text}
            </label>
          </div>
        </td>
        <td>
          <Link
            to={`edms/edit-edm/${edm.id}`}
            className="btn btn-primary btn-sm ml-2"
          >
            編輯
          </Link>

          <div
            className="btn btn-danger btn-sm ml-2"
            onClick={this.onDeleteClick.bind(this, edm.id)}
          >
            刪除
          </div>
        </td>
      </tr>
    );
  }
}

EDMItem.propTypes = {
  deleteEDM: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteEDM }
)(EDMItem);
