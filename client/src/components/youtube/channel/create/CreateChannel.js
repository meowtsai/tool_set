import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextFieldGroup from "../../../common/TextFieldGroup";
import { createChannel } from "../../../../actions/youtubeActions";
import isEmpty from "../../../../validation/is-empty";
class CreateChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      errors: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    //console.log("submit");
    const channelData = {
      id: this.state.id
    };
    console.log(channelData);
    this.props.createChannel(channelData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <h3 className="mt-4 mb-4"> 新增頻道代碼</h3>

        <p className="lead">輸入以下資料</p>
        <div className="row mb-4">
          <div className="col-md-8">
            <form onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="* 頻道代碼"
                name="id"
                value={this.state.id}
                onChange={this.onChange}
                error={errors.id}
                info="輸入頻道代碼"
              />

              <input type="submit" value="確定" className="btn btn-info" />
              <Link
                to="/youtube/channel/list"
                className="btn btn-secondary ml-2"
              >
                取消
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CreateChannel.propTypes = {
  createChannel: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { createChannel }
)(CreateChannel);
