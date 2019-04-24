const express = require("express");
const router = express.Router();
const Events = require("../../models/eventsModel");
const EDM = require("../../models/edmModel");
const validateEDMInput = require("../../validation/v_edm");
//@route: GET /api/edm/test
//@desc: test route
//@access: public
router.get("/test", (req, res) => {
  res.send("EDM Routes Works");
});

//@route: GET /api/edm/get_events
//@desc: return all events
//@access: public
router.get("/get_events", (req, res) => {
  Events.getEvent()
    .then(events => {
      if (events.status === 1) {
        res.send(events);
      } else {
        res.status(400).send(events);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

//@route: GET /api/edm/get_events/:event_id
//@desc: return a events mail list for ref by its id
//@access: public
// select id, nick_name,email from event_preregister limit 100, 5;  如果要分頁
router.get("/get_mail_list/:event_id", (req, res) => {
  const event_id = req.params.event_id;
  Events.getMailList(event_id)
    .then(mail_list => {
      if (mail_list.status === 1) {
        res.send(mail_list);
      } else {
        res.status(400).send(mail_list);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

//@route: POST /api/edm/create
//@desc: create an edm
//@access: public
router.post("/create", (req, res) => {
  const { errors, isValid } = validateEDMInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  let edm = ({ event_id, title } = req.body);
  EDM.createEDM(edm)
    .then(createResult => {
      if (createResult.status === 1) {
        res.send(createResult);
      } else {
        res.status(400).send(createResult);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

//@route: POST /api/edm/modify/:edm_id
//@desc: update edm content by its id
//@access: public
router.post("/modify/:edm_id", (req, res) => {
  const edm_id = req.params.edm_id;
  let edm = ({ event_id, title, mail_content } = req.body);
  EDM.modifyEDM(edm_id, edm)
    .then(modifyResult => {
      if (modifyResult.status === 1) {
        res.send(modifyResult);
      } else {
        res.status(400).send(modifyResult);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

//@route: DELETE /api/edm/delete/:edm_id
//@desc: delete an edm by its id
//@access: public
router.delete("/delete/:edm_id", (req, res) => {
  const edm_id = req.params.edm_id;
  EDM.deleteEDM(edm_id)
    .then(modifyResult => {
      if (modifyResult.status === 1) {
        res.send(modifyResult);
      } else {
        res.status(400).send(modifyResult);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});
//@route: GET /api/edm/get_edms
//@desc: return all edms
//@access: public
router.get("/get_edms", (req, res) => {
  EDM.getEDMs()
    .then(edms => {
      if (edms.status === 1) {
        res.send(edms);
      } else {
        res.status(400).send(edms);
      }
    })
    .catch(err => res.status(400).send({ status: -1, msg: err.message }));
});

//@route: GET /api/edm/get_edms
//@desc: return all edms
//@access: public
router.get("/get_edms/:edm_id", (req, res) => {
  const edm_id = req.params.edm_id;
  EDM.getEDMById(edm_id).then(edm => {
    if (edm.status === 1) {
      res.json(edm);
    } else {
      res.status(400).send(edm);
    }
  });
});

module.exports = router;
