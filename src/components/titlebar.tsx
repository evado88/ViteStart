import React from "react";
import { Link, useLocation } from "react-router-dom";

interface TitlebarArgs {
  title: string;
  section?: string;
  icon?: string;
  url?: string;
}

//the breadcrumb follows the part of the app the page belongs to, so every page
//is labelled consistently whatever section it was given
const sectionFor = (path: string) => {
  if (path.startsWith("/admin")) return { name: "Administration", icon: "cogs" };
  if (path.startsWith("/my")) return { name: "My account", icon: "user" };
  if (path.startsWith("/reports")) return { name: "Reports", icon: "bar-chart" };
  return { name: "Home", icon: "home" };
};

export const Titlebar = ({ title }: TitlebarArgs) => {
  const location = useLocation();
  const section = sectionFor(location.pathname);

  return (
    /* start title */
    <div className="page-bar">
      <div className="page-title-breadcrumb">
        <div className="pull-left">
          <div className="page-title">{title}</div>
        </div>
        <ol className="breadcrumb page-breadcrumb pull-right">
          <li>
            <i className={`fa fa-${section.icon}`}></i>&nbsp;
            <Link to="/" className="parent-item">
              {section.name}
            </Link>
            &nbsp;<i className="fa fa-angle-right"></i>
          </li>
          <li className="active">{title}</li>
        </ol>
      </div>
    </div>
  );
};
