const axios = require("axios");
const config = require("../config/config");
const moment = require("moment");
const nodemailer = require("nodemailer");
const smtp_server = config["smtp_server"];
const url = `http://h54hmt.gameop.easebar.com/logs/h54hmt/report/${moment().format(
  "YYYYMMDD"
)}.log`;

axios
  .get(url, {
    auth: {
      username: config["h54_username"],
      password: config["h54_password"]
    }
  })
  .then(h54_res => {
    const data = complaint_report(h54_res.data);

    let result = Object.keys(data)
      .map((obj, index) => {
        let d1 = new Date(
          moment
            .unix(data[obj].last_report_time)
            .utc(false)
            .add(2, "hours")
            .format("YYYY-MM-DD HH:mm:ss")
        );

        let d2 = new Date(moment().format("YYYY-MM-DD HH:mm:ss"));

        if (data[obj].rpt_count > config["h54_rpt_count"] && d1 > d2) {
          //console.log(data[obj]);
          return `[${c_servers[data[obj].server]}] - ${
            data[obj].r_name
          } ( ${obj} )  被舉報${data[obj].rpt_count}次`;
        } else {
          return "NA";
        }
      })
      .filter(item => item !== "NA");

    //console.log(result);

    if (result.length > 0) {
      //console.log(result);
      send_mail(result);
    }

    //res.json(h54_res.data);
  })
  .catch(err => {
    console.error(err.message);
    //return res.status(400).send(err.message);
  });

const c_servers = {
  11001: "11001 聖者廣者",
  11002: "11002 天涯海角"
};
const c_types = {
  1: "暱稱不雅",
  2: "言行不雅",
  3: "使用外掛",
  4: "線下交易",
  5: "涉嫌詐欺",
  6: "其他理由"
};

const complaint_report = complaint => {
  let formated_data = [];
  let summary_data;
  if (complaint.length > 0) {
    var lines = complaint.split("\n");
    for (var line = 0; line < lines.length - 1; line++) {
      //find first comma to cut
      const item = lines[line];
      let str1 = item.slice(item.indexOf(",") + 1);
      //console.log(line);
      const objItem = JSON.parse(str1);
      formated_data.push(objItem);
    }

    var summary = formated_data.reduce(function(prev, curr) {
      if (prev[curr.r_roleid]) {
        prev[curr.r_roleid].rpt_count = prev[curr.r_roleid].rpt_count + 1;
        prev[curr.r_roleid].last_report_time = curr.report_time;
      } else {
        prev[curr.r_roleid] = {
          rpt_count: 1,
          r_name: curr.r_name.slice(
            curr.r_name.indexOf(">") + 1,
            curr.r_name.lastIndexOf("<")
          ),
          server: curr.server,
          last_report_time: curr.report_time
        };
      }
      return prev;
    }, {});

    return summary;
  }
};

const send_mail = list => {
  let transporter = nodemailer.createTransport(smtp_server);

  const html_template = list.join("<br />");

  let mailOptions = {
    from: '"海島Log" <no-reply@longeplay.com.tw>', // sender address
    to: config["h54_receivers"], // list of receivers
    subject: `海島玩家檢舉動態 ${moment().format("YYYY-MM-DD HH:mm:ss")}`, // Subject line
    html: html_template // html body
  };

  // send mail with defined transport object
  let info = transporter.sendMail(mailOptions);

  //console.log("Message sent: %s", info.messageId);

  /// EMAIL /////
};
