const db = require("./db_conn");

const EDM = {
  createEDM: async edm => {
    return await db
      .promise()
      .query("insert into edms set ?", edm)
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: rows.insertId };
        } else {
          return { status: -1, msg: "新增失敗" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  modifyEDM: async (edm_id, edm) => {
    return await db
      .promise()
      .query("update edms set ? where id=?", [edm, edm_id])
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: "修改成功" };
        } else {
          return { status: -1, msg: "修改失敗" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  deleteEDM: async edm_id => {
    return await db
      .promise()
      .query("delete from edms where id=?", [edm_id])
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: "刪除成功" };
        } else {
          return { status: -1, msg: "刪除失敗" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getEDMs: async () => {
    return await db
      .promise()
      .query(
        `select a.id, a.event_id, a.title, a.create_time,a.status,a.mail_title,a.mail_content,a.begin_time,a.status ,
      count(b.status) total_user, sum(case b.status when 2 then 1 else 0 end) 'sending', sum(case b.status when 7 then 1 else 0 end) 'sent'
      from edms a left join event_preregister b
      on a.event_id= b.event_id group by a.id, a.event_id, a.title, a.create_time,a.status,a.mail_title,a.mail_content,a.begin_time,a.status`
      )
      .then(([rows, fields]) => ({ status: 1, msg: rows }))
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },

  getEDMById: async edm_id => {
    return await db
      .promise()
      .query(
        `select a.id, a.event_id, a.title, a.create_time,a.status,a.mail_title,a.mail_content,a.begin_time,a.status ,
        count(b.status) total_user, sum(case b.status when 2 then 1 else 0 end) 'sending', sum(case b.status when 7 then 1 else 0 end) 'sent'
        from edms a left join event_preregister b
        on a.event_id= b.event_id
         where a.id=${edm_id}`
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: `沒有這筆edm資料( ID = ${edm_id})` };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  }
};

module.exports = EDM;
