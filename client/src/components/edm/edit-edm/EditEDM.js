import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextFieldGroup from "../../common/TextFieldGroup";
import SelectListGroup from "../../common/SelectListGroup";
import InputGroup from "../../common/InputGroup";
import { getEvents, editEDM, getEDM } from "../../../actions/edmActions";
import isEmpty from "../../../validation/is-empty";
import moment from "moment";

import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import * as Showdown from "showdown";
class EditEDM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      event_id: "",
      mail_title: "",
      mail_content: "",
      begin_time: "",
      status: 0,
      tab: "write"
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onHandleMdeChange = this.onHandleMdeChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
  }

  componentDidMount() {
    this.props.getEvents();
    if (this.props.match.params.edm_id) {
      this.props.getEDM(this.props.match.params.edm_id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.edms.edm) {
      const edm = nextProps.edms.edm;
      //if a field not exist make it an empty string
      edm.title = !isEmpty(edm.title) ? edm.title : "";
      edm.event_id = !isEmpty(edm.event_id) ? edm.event_id : "";
      edm.mail_title = !isEmpty(edm.mail_title) ? edm.mail_title : "";
      edm.mail_content = !isEmpty(edm.mail_content) ? edm.mail_content : "";
      edm.begin_time = !isEmpty(edm.begin_time) ? edm.begin_time : "";
      edm.status = !isEmpty(edm.status) ? edm.status : "";

      this.setState({
        title: edm.title,
        event_id: edm.event_id,
        mail_title: edm.mail_title,
        mail_content: edm.mail_content,
        status: edm.status,
        begin_time: moment(edm.begin_time).format("YYYY-MM-DDTHH:mm") //2019-04-24T14:00
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    //console.log("submit");
    const edm_id = this.props.match.params.edm_id;
    const edmData = {
      title: this.state.title,
      event_id: this.state.event_id,
      mail_title: this.state.mail_title,
      mail_content: this.state.mail_content,
      status: this.state.status,
      begin_time: this.state.begin_time
    };
    console.log(edmData);
    this.props.editEDM(edm_id, edmData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log({ [e.target.name]: e.target.value });
  }
  onHandleMdeChange(value) {
    this.setState({ mail_content: value });
  }
  handleTabChange = tab => {
    console.log(tab);
    this.setState({ tab });
  };
  render() {
    const { events, update_status } = this.props.edms;
    const { errors } = this.props;

    let options = [];
    if (events.length > 0) {
      options = events.map(event => ({
        label: event.event_name,
        value: event.id
      }));
    }

    options = [{ label: "** 選擇一個活動 **", value: 0 }, ...options];

    let updateInfo;
    if (!isEmpty(update_status)) {
      if (update_status.status === 1) {
        updateInfo = (
          <div className="alert alert-success" role="alert">
            {update_status.msg}
          </div>
        );
      } else {
        updateInfo = (
          <div className="alert alert-danger" role="alert">
            {update_status.msg}
          </div>
        );
      }
    }

    //0-初始 1-進入排程中 2-暫停 4-已經完成
    const status_options = [
      { label: "0-初始", value: 0 },
      { label: "1-開始排程", value: 1 },
      { label: "2-暫停", value: 2 },
      { label: "4-已經完成", value: 4 }
    ];

    return (
      <div className="container">
        <h3 className="mt-4 mb-4"> 修改 EDM 項目</h3>
        {updateInfo}
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
                value={this.state.event_id.toString()}
                onChange={this.onChange}
                error={errors.event_id}
                options={options}
                info="輸入這個EDM的發送對象的關聯活動。"
              />

              <hr />
              <TextFieldGroup
                placeholder="* EDM Mail 主旨欄"
                name="mail_title"
                value={this.state.mail_title}
                onChange={this.onChange}
                error={errors.mail_title}
                info="輸入要發送的EDM 郵件的主旨, 這欄位收件玩家會看到喔"
              />

              <div className="mb-1">
                <ReactMde
                  onChange={this.onHandleMdeChange}
                  value={this.state.mail_content}
                  onTabChange={this.handleTabChange}
                  generateMarkdownPreview={markdown =>
                    Promise.resolve(this.converter.makeHtml(markdown))
                  }
                  selectedTab={this.state.tab}
                />
                <small className="form-text text-muted">EDN 郵件內文</small>
              </div>
              <hr />
              <InputGroup
                placeholder="* EDM 開始發送日期"
                type="datetime-local"
                name="begin_time"
                value={this.state.begin_time}
                onChange={this.onChange}
                error={errors.begin_time}
                info="輸入EDM 要開始發送的日期時間"
                icon="far fa-calendar-alt"
              />

              <SelectListGroup
                placeholder="發送狀態"
                name="status"
                value={this.state.status.toString()}
                onChange={this.onChange}
                error={errors.status}
                options={status_options}
                info="變更發送狀態"
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

EditEDM.propTypes = {
  getEvents: PropTypes.func.isRequired,
  editEDM: PropTypes.func.isRequired,
  getEDM: PropTypes.func.isRequired,
  edms: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  edms: state.edms
});
export default connect(
  mapStateToProps,
  { getEvents, editEDM, getEDM }
)(EditEDM);
