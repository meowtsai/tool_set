const isEmpty = require("./is-empty");
const Validator = require("validator");
module.exports = function validateG66CSVInput(data) {
  let errors = {};

  data.url = !isEmpty(data.url) ? data.url : "";

  if (isEmpty(data.url)) {
    errors.url = "請輸入URL";
  }
  if (!Validator.isURL(data.url)) {
    errors.url = "請輸入URL 格式的字串.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
