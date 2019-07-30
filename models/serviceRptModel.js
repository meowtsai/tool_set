const { db2 } = require("./db_conn");

const ServiceRpt = {
  getCaseCountByDateRange: async (beginDt, endDt, cs_member) => {
    //console.log(cs_member);
    const conditional_query =
      cs_member !== "" ? ` and allocate_admin_uid=${cs_member.uid}` : "";
    //console.log("conditional_query", conditional_query);
    return await db2
      .promise()
      .query(
        `select g.name as game_name, b.game_id, count(*) as cnt ,
        SUM(case when allocate_status='1' then 1 else 0 end) as 'status_process', 
        SUM(case when allocate_status='2' then 1 else 0 end) as 'status_done',
        SUM(case when allocate_admin_uid='113' then 1 else 0 end) as 'status_robot'
        from questions q left join servers b on q.server_id =b.server_id 
        left join games g on b.game_id = g.game_id 
        where allocate_status is not null and allocate_date between ? and ? 
        ${conditional_query}
        group by g.name, b.game_id order by cnt desc;`,
        [beginDt, endDt + " 23:59:59"]
      )
      .then(([rows, fields]) => ({ cs_member, result: rows }))
      .catch(err => {
        //console.log(err);
        return err;
      });
  },
  getCsMembers: async () => {
    return await db2
      .promise()
      .query(`select uid,name from admin_users where role='cs_master'`)
      .then(([rows, fields]) => rows)
      .catch(err => {
        console.log(err);
        return null;
      });
  }
};

module.exports = ServiceRpt;
