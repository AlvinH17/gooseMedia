import React from "react";

const HeaderInfo = ({ text }) => {
  return (
    <header
      style={{
        textAlign: "center",
        padding: "0.7rem",
        background: "#f8f9fa",
        minWidth: "fit-content",
        margin: "0 auto 1.2rem",
        borderRadius: "8px",
      }}
    >
      <h3>{text}</h3>
    </header>
    // <div>HeaderInfo</div>
  );
};

export default HeaderInfo;
