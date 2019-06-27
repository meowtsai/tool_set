// * query a data set
// * 開始parse
// * 塞入資料
// * done

//每天凌晨尋找 allocate_date > 昨天 的單子
//把allocate_result 中 日期時間大於昨天0時的紀錄填入log表格
const moment = require("moment");

const log_day = moment()
  .subtract(1, "days")
  .format("YYYY-MM-DD");

const { db1, db2 } = require("../models/db_conn");
//const sql_query = `SELECT id,allocate_result from questions where allocate_finish_date between '2019-05-01' and '2019-06-26 23:59:59' and allocate_status<>0`;
const sql_query = `SELECT id,allocate_result from questions where allocate_date between '${log_day}' and '${log_day} 23:59:59' and allocate_status<>0`;

//const sql_query = `SELECT id,allocate_result from questions where id in(244159,244197,244210)`;
async function main() {
  const get_data = async () => {
    const [rows, fields] = await db2.promise().query(sql_query);

    return rows;

    //console.log(rows);
    console.log("-------------------");
    //console.log(fields);
  };

  const get_admin_uid = async admin_name => {
    //console.log("get_admin_uid", admin_name);
    const [rows, fields] = await db2
      .promise()
      .query("select uid from admin_users where name=?", [admin_name]);
    //console.log("get_admin_uid", rows);
    return rows[0].uid;
  };

  const insert_record = record => {
    db2.query("INSERT INTO question_allocate_logs SET ?", record, function(
      error,
      results,
      fields
    ) {
      if (error) {
        console.log(record, error.message);
      }
    });
  };

  const rows = await get_data();
  const data_count = rows.length;

  if (data_count > 0) {
    //console.log(`共${data_count}筆`);

    for (item of rows) {
      //console.log(`Qid = ${item.id}`);
      //console.log(`處理 = ${item.allocate_result}`);

      result_array = item.allocate_result.split("<br>");
      for (let index = 0; index < result_array.length - 1; index++) {
        const element = result_array[index];
        const dt = element.split(" - ")[0].trim();
        const text = element.split(" - ")[1].trim();
        //console.log(`第${index}個 = ${element}`);

        const admin_name = text.split("：")[0];
        const admin_text = text.split("：")[1];
        // console.log(
        //   `第${index}個 =時間 ${dt}  人物**  ${admin_name}  說** ${admin_text}`
        // );

        const admin_uid = await get_admin_uid(admin_name);
        //console.log(admin_uid);

        const record = {
          create_time: dt,
          question_id: item.id,
          admin_uid,
          note: admin_text
        };

        const record_dt = new Date(dt);
        const standard_dt = new Date(log_day);
        if (record_dt > standard_dt) {
          insert_record(record);
          //console.log(dt, "Bigger!");
        } else {
          //console.log(dt, "Smaller!");
        }
        //insert_record(record);
      }
    }
  }
}

main();

setTimeout(function() {
  process.exit(1);
}, 30000);
