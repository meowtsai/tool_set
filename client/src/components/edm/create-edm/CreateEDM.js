import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextFieldGroup from "../../common/TextFieldGroup";
import SelectListGroup from "../../common/SelectListGroup";
import { getEvents, createEDM } from "../../../actions/edmActions";

class CreateEDM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      event_id: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getEvents();
  }

  onSubmit(e) {
    e.preventDefault();
    //console.log("submit");
    const edmData = {
      title: this.state.title,
      event_id: this.state.event_id
    };
    console.log(edmData);
    this.props.createEDM(edmData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { events } = this.props.edms;
    const { errors } = this.props;

    let options = [];
    if (events.length > 0) {
      options = events.map(event => ({
        label: event.event_name,
        value: event.id
      }));
    }

    options = [{ label: "** 選擇一個活動 **", value: 0 }, ...options];

    return (
      <div className="container">
        <h3 className="mt-4 mb-4"> 新增 EDM 項目</h3>

        <p className="lead">輸入以下資料</p>
        <div className="row mb-4">
          <div className="col-md-8">
            <form onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="* EDM 名稱"
                name="title"
                value={this.state.title}
                onChange={this.onChange}
                error={errors.title}
                info="輸入這份EDM的用途目的名稱"
              />
              <SelectListGroup
                placeholder="關聯活動"
                name="event_id"
                value={this.state.event_id}
                onChange={this.onChange}
                error={errors.event_id}
                options={options}
                info="輸入這個EDM的發送對象的關聯活動。"
              />

              <input type="submit" value="確定" className="btn btn-info" />
              <Link to="/edms" className="btn btn-secondary ml-2">
                取消
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CreateEDM.propTypes = {
  getEvents: PropTypes.func.isRequired,
  createEDM: PropTypes.func.isRequired,
  edms: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  edms: state.edms
});
export default connect(
  mapStateToProps,
  { getEvents, createEDM }
)(CreateEDM);
