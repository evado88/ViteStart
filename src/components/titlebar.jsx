import React from "react";

export const Titlebar = ({ title, section, icon }) => {
  return (
    /* start title */
    <div className="page-bar">
      <div className="page-title-breadcrumb">
        <div className="pull-left">
          <div className="page-title">{title}</div>
        </div>
        <ol className="breadcrumb page-breadcrumb pull-right">
          <li>
            <i className={`fa fa-${icon}`}></i>&nbsp;
            <a
              className="parent-item"
              href="https://www.einfosoft.com/templates/admin/smart/source/light/index.html"
            >
              {section}
            </a>
            &nbsp;<i className="fa fa-angle-right"></i>
          </li>
          <li className="active">{title}</li>
        </ol>
      </div>
    </div>
  );
};
