const { db1, db2 } = require("./db_conn");

const YoutuberVideo = {
  get_all: async () => {
    return await db2
      .promise()
      .query(
        `select id, title, published_at, update_time,channelId, country,view_count ,like_count,dislike_count, comment_count
          from youtubers_videos`
      )
      .then(([rows, fields]) => ({ status: 1, msg: rows }))
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  get_one: async id => {
    return await db2
      .promise()
      .query(
        `select  id, title, published_at, update_time,channelId, country,view_count ,like_count,dislike_count, comment_count
          from youtubers_videos where id=?`,
        id
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: "沒有這個資料" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  get_videos_by_game_id: async (game_id, begin_date, end_date) => {
    // console.log(game_id);
    // console.log(begin_date);
    // console.log(end_date);
    return await db2
      .promise()
      .query(
        `select games.name as game_name,  a.channelId,b.title, count(a.id) as video_count, sum(a.view_count) as view_count, sum(a.like_count) as like_count, sum(a.dislike_count) as dislike_count , sum(a.comment_count) as comment_count from youtubers_videos a inner join youtubers b on a.channelId =b.id
        inner join games on a.game_id = games.game_id
        where  a.published_at between ? and ?
        group by games.name,a.channelId,b.title`,
        [begin_date, end_date]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows };
        } else {
          return { status: -1, msg: "沒有這個資料" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },

  create: async video => {
    return await db1
      .promise()
      .query("insert into youtubers_videos set ?", video)
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
    return await db1
      .promise()
      .query("update youtubers_videos set ? where id=?", [yt_data, id])
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
  insertOrUpdate: async yt_data_1 => {
    return await db1
      .promise()
      .query(
        "INSERT INTO youtubers_videos(id,title,published_at,update_time,channelId,view_count,like_count,dislike_count,comment_count) VALUES ",
        []
      )
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: "修改成功" };
        } else {
          return { status: -1, msg: "修改失敗" };
        }
      })
      .catch(err => {
        console.log("insertOrUpdate err", err);
        return { status: -1, msg: err.message };
      });
  },
  delete: async id => {
    return await db1
      .promise()
      .query("delete from youtubers_videos where id=?", [id])
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

module.exports = YoutuberVideo;
