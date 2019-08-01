const { db1, db2 } = require("./db_conn");

const Admin_user = {
  findOne: async ({ account }) => {
    console.log("findOne", account);
    return await db2
      .promise()
      .query("select * from admin_users where account=?", [account])
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows[0];
        } else {
          return null;
        }
      })
      .catch(err => ({ error: err.message }));
  },
  findByUid: async ({ uid }) => {
    console.log("uid", uid);
    return await db2
      .promise()
      .query("select uid,account,name,role from admin_users where uid=?", [uid])
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows[0];
        } else {
          return null;
        }
      })
      .catch(err => ({ error: err.message }));
  },
  save: async user => {
    return await db1
      .promise()
      .query("insert into admin_users set ?", user)
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          // {
          //     "fieldCount": 0,
          //     "affectedRows": 1,
          //     "insertId": 165,
          //     "info": "",
          //     "serverStatus": 2,
          //     "warningStatus": 0
          // }
          return rows;
        } else {
          return { error: "新增失敗" };
        }
      })
      .catch(err => ({ error: err.message }));
  },
  findByUidAndUpdatePassword: async (uid, { password }) => {
    return await db1
      .promise()
      .query("Update admin_users set ? where uid=?", [{ password }, uid])
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return rows;
        } else {
          return { error: "更新失敗" };
        }
      })
      .catch(err => ({ error: err.message }));
  },
  checkPermission: async (resource, op, role) => {
    return await db2
      .promise()
      .query(
        "select count(*) as cnt from admin_permissions where role=? and resource=? and instr(operations,?) >0",
        [role, resource, op]
      )
      .then(([rows, fields]) => {
        if (rows[0].cnt > 0) {
          return true;
        } else {
          return false;
        }
      })
      .catch(err => ({ error: err.message }));
  },
  getAdminRoles: async () => {
    return await db2
      .promise()
      .query("select role, role_desc, parent from admin_roles")
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows;
        } else {
          return null;
        }
      })
      .catch(err => ({ error: err.message }));
  },
  saveAdminRole: async role => {
    return await db1
      .promise()
      .query("insert into admin_roles set ?", role)
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return rows;
        } else {
          return { error: "新增失敗" };
        }
      })
      .catch(err => ({ error: err.message }));
  },
  findByAdminRoleIdAndUpdate: async (role, { role_desc, parent }) => {
    return await db1
      .promise()
      .query("Update admin_roles set ? where role=?", [
        { role_desc, parent },
        role
      ])
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return rows;
        } else {
          return { error: "更新失敗" };
        }
      })
      .catch(err => ({ error: err.message }));
  },
  findAdminRole: async ({ role }) => {
    return await db2
      .promise()
      .query("select * from admin_roles where role=?", [role])
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows[0];
        } else {
          return null;
        }
      })
      .catch(err => ({ error: err.message }));
  },
  findAdminRoleByRoleIdAndRemove: async role => {
    return await db1
      .promise()
      .query("Delete from admin_roles where role=?", [role])
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          //$this->DB1->set("role", "")->where("role", $role)->update("admin_users");
          db1.query("UPDATE admin_users set role='' where role=?", [role]);

          return rows;
        } else {
          return { error: "刪除失敗" };
        }
      })
      .catch(err => ({ error: err.message }));
  }
};

module.exports = Admin_user;
