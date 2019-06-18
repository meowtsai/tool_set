const axios = require("axios");
const config = require("../config/config");
const db = require("../models/db_conn");
// const path = require("path");
// const fs = require("fs");
const moment = require("moment");
const url = `${config["h54_url_prefix"]}/prepaid/${moment().format(
  "YYYYMMDD"
)}.log`;

//const url = "http://h54hmt.gameop.easebar.com/logs/h54hmt/prepaid/20190607.log";
// 1. get log
axios
  .get(url, {
    auth: {
      username: config["h54_username"],
      password: config["h54_password"]
    }
  })
  .then(h54_res => {
    // 2. save the data to a text file , /h54_prepaid/20190605.json
    // const directoryPath = path.join(__dirname, "/h54/prepaid");
    // const filename = `${moment().format("YYYYMMDD")}.log`;
    // fs.writeFile(`${directoryPath}/${filename}`, h54_res.data, err => {
    //   if (err) throw err;
    //   console.log(`The file ${filename} has been saved.`);
    // });

    // 3. insert to db
    const data = prepaid_report(h54_res.data);
    for (let index = 0; index < data.length; index++) {
      create_order(data[index]);
    }

    setTimeout(function() {
      process.exit(1);
    }, 30000);

    //console.log(data);
  })
  .catch(err => {
    console.error(err.message);
  });

const prepaid_report = prepaid => {
  let formated_data = [];

  if (prepaid.length > 0) {
    var lines = prepaid.split("\n");
    for (var line = 0; line < lines.length - 1; line++) {
      //find first comma to cut
      const item = lines[line];
      let str1 = item.slice(item.indexOf(",") + 1);
      //console.log(line);
      const trxObj = JSON.parse(str1);

      const forDataObj = {
        transaction_id: trxObj.transaction_id,
        transaction_type: trxObj.app_channel.split("@")[1],
        account: trxObj.account_id.split("@")[0],
        role_id: trxObj.role_id,
        role_name: trxObj.role_name.slice(
          trxObj.role_name.indexOf(">") + 1,
          trxObj.role_name.lastIndexOf("<")
        ),
        server: trxObj.server,
        product_id: trxObj.prepaid_detail.pid,
        amount: trxObj.prepaid_detail.price * 5,
        ip: trxObj.ip,
        game_id: trxObj.gameid,
        create_time: moment.unix(trxObj.pay_time).format("YYYY-MM-DD HH:mm:ss")
      };

      formated_data.push(forDataObj);
    }

    return formated_data;
  }
};

const create_order = trxObj => {
  db.query("INSERT INTO negame_orders SET ?", trxObj, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
  });
};
