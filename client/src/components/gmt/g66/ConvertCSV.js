import React, { Component } from "react";
import { connect } from "react-redux";
import { CSVLink } from "react-csv";

import InputGroup from "../../common/InputGroup";
import { getCSV } from "../../../actions/gmtActions";

class ConvertCSV extends Component {
  state = {
    url: ""
  };

  onSubmit = e => {
    e.preventDefault();

    this.props.getCSV({ url: this.state.url });
  };

  onChange = e => {
    this.setState({ url: e.target.value.trim() });
  };
  componentDidMount() {
    //this.props.getCSV("http://jjj");
  }
  render() {
    const { csv } = this.props.gmt;
    const { errors } = this.props;
    //************************** */
    let tableHeader;

    let tableRow = [];
    let item_attr_str;
    let csvData = [];
    if (csv.length > 0) {
      var lines = csv.split("\n");
      let colIndex = 0;

      for (var line = 0; line < lines.length; line++) {
        // By tabs
        //console.log(line);
        var tabs = lines[line].split("\t");
        for (var tab = 0; tab < tabs.length; tab++) {
          //alert(tabs[tab]);
          if (line === 0) {
            if (tabs[tab] === "item_attr_str") {
              colIndex = tab;
            }
          }
        }

        if (line === 0) {
          console.log(tabs);
          tabs.push("extracted item_ids");
          csvData.push(tabs);

          tableHeader = tabs.map(tabItem => <th>{tabItem}</th>);
        } else {
          //find all item_ids in item_attr_str field
          if (tabs[colIndex] !== undefined) {
            item_attr_str = tabs[colIndex].slice(
              tabs[colIndex].indexOf("={") + 1
            );
            let removeIndexStart = item_attr_str
              .substring(0, item_attr_str.lastIndexOf("}"))
              .lastIndexOf("}");
            //item_attr_str = tabs[colIndex].replace("{equip=", "");
            //let removeIndexStart = item_attr_str.lastIndexOf(",");
            item_attr_str = item_attr_str.substring(0, removeIndexStart + 1);
            let allItems = [];
            try {
              let itemObj = JSON.parse(item_attr_str);

              allItems.push(itemObj.item_id);
              if (itemObj.modules) {
                for (const [key, value] of Object.entries(itemObj.modules)) {
                  //console.log(key, value);
                  if (value.item_id) {
                    allItems.push(value.item_id);
                  }
                }
              }
            } catch (e) {
              console.log(`line${item_attr_str}`, e.message);
            }

            tabs.push(`\'${allItems.join(",")}`);
          }

          csvData.push(tabs);
          tableRow.push(tabs.map(tabItem => <td>{tabItem}</td>));
        }
      }

      //console.log(item_attr_str);
    }
    return (
      <div>
        <h3 className="mt-4 mb-4"> 解析 G66 道具 CSV</h3>

        <p className="lead">
          輸入csv 網址, 工具會找出item_attr_str欄位中所有item_id
        </p>
        <div className="row mb-4">
          <div className="col-md-12">
            <form onSubmit={this.onSubmit.bind(this)}>
              log 報表 的 URL:
              <InputGroup
                placeholder="* log 報表 的 URL"
                type="text"
                name="url"
                value={this.state.url}
                onChange={this.onChange.bind(this)}
                error={errors.url}
                info="輸入URL 例如: http://g66naxx2tw.gameop.easebar.com/mg_script_data/2019-04/MEOW_1555920521189_aaaQZ383fokCdd7jXOdPw.csv"
                icon="fas fa-globe"
              />
              <input type="submit" value="確定" className="btn btn-info" />
            </form>
          </div>
        </div>
        <div>
          {csvData.length > 0 && (
            <CSVLink data={csvData} separator={"\t"}>
              下載 csv檔案
            </CSVLink>
          )}

          <table
            className="table table-bordered table-sm"
            style={{ fontSize: "9pt" }}
          >
            <thead>
              <tr>{tableHeader}</tr>
            </thead>
            <tbody>
              {tableRow.length > 0 && tableRow.map(aRow => <tr>{aRow}</tr>)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  gmt: state.gmt,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getCSV }
)(ConvertCSV);
