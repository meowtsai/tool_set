const express = require("express");
const router = express.Router();
const serviceRpt = require("../../models/serviceRptModel");
const moment = require("moment");

//@route: GET /api/service_rpt/test
//@desc: test route
//@access: public
router.get("/test", (req, res) => {
  res.send("service_rpt Routes Works");
});

//@route: GET /api/service_rpt/home
//@desc: get overview of op report
//@access: public
router.get("/home", async (req, res) => {
  //set default date range if not requested
  const begin_date = req.query.begin_date
    ? req.query.begin_date
    : moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD");
  const end_date = req.query.end_date
    ? req.query.end_date
    : moment().format("YYYY-MM-DD");

  const cs_member = req.query.cs !== "" ? req.query.cs : "";
  //console.log("begin_date", begin_date);
  //console.log("end_date", end_date);
  const summary = await serviceRpt.getCaseCountByDateRange(
    begin_date,
    end_date,
    cs_member
  );

  res.json({ summary });
});

router.get("/cs_members", async (req, res) => {
  //set default date range if not requested

  const cs_members = await serviceRpt.getCsMembers();

  res.json(cs_members);
});

module.exports = router;
