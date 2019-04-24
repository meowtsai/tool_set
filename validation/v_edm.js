const isEmpty = require("./is-empty");

module.exports = function validateEDMInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.event_id = !isEmpty(data.event_id) ? data.event_id : "";

  if (isEmpty(data.title)) {
    errors.title = "請輸入EDM的名稱或用途";
  }

  if (isEmpty(data.event_id)) {
    errors.event_id = "請選擇關聯活動";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
