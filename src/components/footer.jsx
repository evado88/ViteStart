import React from "react";

export const Footer = ({ names, title }) => {
  return (
    /* start footer */
    <div className="page-footer">
      <div className="page-footer-inner">
        2025 Smart University Theme By
        <a
          href="mailto:redstartheme@gmail.com"
          target="_top"
          className="makerCss"
        >
          Redstar Theme
        </a>
      </div>
      <div className="scroll-to-top" style={{ display: "none" }}>
        <i className="icon-arrow-up"></i>
      </div>
    </div>
  );
};
