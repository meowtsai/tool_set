const db = require("./db_conn");

const Youtuber = {
  get_all: async () => {
    return await db
      .promise()
      .query(
        `select id, title, published_at, update_time,thumbnails, country,view_count , subscriber_count, video_count
          from youtubers`
      )
      .then(([rows, fields]) => ({ status: 1, msg: rows }))
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  get_one: async id => {
    return await db
      .promise()
      .query(
        `select id, title, published_at, update_time,thumbnails, country,view_count , subscriber_count, video_count
          from youtubers where id=?`,
        id
      )
      .then(([rows, fields]) => ({ status: 1, msg: rows[0] }))
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  create: async id => {
    return await db
      .promise()
      .query("insert into youtubers set id=?", id)
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: rows.insertId };
        } else {
          return { status: -1, msg: "新增失敗" };
        }
      })
      .catch(err => {
        return { status: -1, msg: err.message };
      });
  },
  modify: async (id, yt_data) => {
    return await db
      .promise()
      .query("update youtubers set ? where id=?", [yt_data, id])
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: "修改成功" };
        } else {
          return { status: -1, msg: "修改失敗" };
        }
      })
      .catch(err => {
        return { status: -1, msg: err.message };
      });
  },
  delete: async id => {
    return await db
      .promise()
      .query("delete from youtubers where id=?", [id])
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
  }
};

module.exports = Youtuber;
