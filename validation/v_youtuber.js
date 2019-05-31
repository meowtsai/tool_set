const isEmpty = require("./is-empty");

module.exports = function validateYoutuberInput(data) {
  let errors = {};

  data.id = !isEmpty(data.id) ? data.id : "";

  if (isEmpty(data.id)) {
    errors.id = "請輸入Youtuber的頻道ID";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
