const db = require("./db_conn");

const Events = {
  getEvent: async () => {
    return await db
      .promise()
      .query("select id, game_id, event_name from events where status=1")
      .then(([rows, fields]) => ({ status: 1, msg: rows }))
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getMailList: async event_id => {
    return await db
      .promise()
      .query(
        `select id,nick_name,email from event_preregister where event_id=${event_id} limit 20`
      )
      .then(([rows, fields]) => ({ status: 1, msg: rows }))
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  }
};

module.exports = Events;
