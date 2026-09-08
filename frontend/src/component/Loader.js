import React from "react";

function Loader({ text = "Loading data..." }) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default Loader;
