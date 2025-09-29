import React from "react";

export const Footer = ({ names, title }) => {
  return (
    /* start footer */
    <div className="page-footer">
      <div className="page-footer-inner">
         &copy;2025 SACCO. All Rights Reserved

      </div>
      <div className="scroll-to-top" style={{ display: "none" }}>
        <i className="icon-arrow-up"></i>
      </div>
    </div>
  );
};
