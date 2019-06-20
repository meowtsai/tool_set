const axios = require("axios");
const config = require("../config/config");
const geoip = require("geoip-lite");
const { db1, db2 } = require("../models/db_conn");

// const path = require("path");
// const fs = require("fs");
const moment = require("moment");
const url = `${config["h54_url_prefix"]}/prepaid/${moment()
  .subtract(1, "days")
  .format("YYYYMMDD")}.log`;

const game_id = "H54";
//const url = "http://h54hmt.gameop.easebar.com/logs/h54hmt/prepaid/20190606.log";
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
      update_whale();
    }, 3000);

    // setTimeout(function() {
    //   process.exit(1);
    // }, 30000);

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
  db2.query("INSERT INTO negame_orders SET ?", trxObj, function(
    error,
    results,
    fields
  ) {
    if (error) {
      console.log(error.message);
    }
  });
};

const update_whale = async () => {
  const [rows, fields] = await db2
    .promise()
    .query(
      "insert into whale_users(uid,char_in_game_id,server_name,deposit_total,site) select account as uid,role_id as char_in_game_id,server as server_name,sum(amount) as total,'H54' as site  from negame_orders where  game_id='h54naxx2hmt' group by account, server, role_id having sum(amount)>=20000 ON DUPLICATE KEY UPDATE deposit_total=(select sum(amount) from negame_orders where  game_id='h54naxx2hmt' and whale_users.char_in_game_id=negame_orders.role_id)"
    );

  console.log("update_whale", rows);
  if (rows.affectedRows > 0) {
    const [rows1, fields1] = await db2
      .promise()
      .query(
        "update whale_users set latest_topup_date =(select max(create_time) from negame_orders where game_id='h54naxx2hmt' and role_id=whale_users.char_in_game_id) where site='H54'"
      );
    console.log("update_whale latest_topup_date", rows1);

    const [rows2, fields2] = await db2
      .promise()
      .query(
        "update whale_users set char_name =(select role_name from negame_orders where game_id='h54naxx2hmt' and role_id=whale_users.char_in_game_id  order by create_time desc limit 1 )  where site='H54'"
      );

    console.log("update_whale char_name", rows2);

    const [rows3, fields3] = await db2
      .promise()
      .query(
        "update whale_users set ip =(select ip from negame_orders where game_id='h54naxx2hmt' and role_id=whale_users.char_in_game_id  order by create_time desc limit 1 )  where site='H54'"
      );

    db2
      .promise()
      .query(
        "SELECT char_in_game_id,ip,country FROM whale_users WHERE site ='H54'"
      )
      .then(([rows, fields]) => {
        rows.forEach(row => {
          console.log(row);
          const geo = geoip.lookup(row.ip);
          console.log(geo);
          db2.query(
            "update whale_users set country =? where char_in_game_id=? and site='H54' ",
            [geo.country, row.char_in_game_id],
            function(error, results, fields) {
              if (error) {
                console.log(error.message);
              }
            }
          );
        });
      })
      .catch(err => {
        console.log(err.message);
        //return { status: -1, msg: err.message };
      });

    setTimeout(function() {
      process.exit(1);
    }, 30000);
  }
};
