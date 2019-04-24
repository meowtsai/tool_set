import React from "react";
import loading from "./loading.gif";
export default function Spinner() {
  return (
    <div>
      <img
        style={{
          width: "200px",
          height: "200px",
          margin: "auto",
          display: "block"
        }}
        src={loading}
        alt="Loading..."
      />
    </div>
  );
}
