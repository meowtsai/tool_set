import React from "react";
import PropTypes from "prop-types";

const Progressbar = ({ type, percentage, capation }) => {
  //console.log("percentage", typeof percentage);
  return (
    <div
      className={`progress-bar bg-${type}`}
      role="progressbar"
      style={{ width: `${percentage}%` }}
      aria-valuenow={percentage}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {capation}
    </div>
  );
};

Progressbar.propTypes = {
  type: PropTypes.string.isRequired,
  percentage: PropTypes.number,
  capation: PropTypes.string.isRequired
};

export default Progressbar;
