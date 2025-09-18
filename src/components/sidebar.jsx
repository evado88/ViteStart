import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { navigation } from "../navigation/app-navigation";

function ExpandableGroup({ navitem }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <li
      className={`nav-item ${isOpen ? "open" : ""}`}
      key={navitem.key}
      onClick={toggle}
    >
      <Link to={navitem.path} className="nav-link nav-toggle">
        {" "}
        <i className={navitem.icon}></i>
        <span className="title">{navitem.text}</span>
        <span className="selected"></span>
        <span className={`arrow ${isOpen ? "open" : ""}`}></span>
      </Link>
      <ul
        ref={contentRef}
        className={`sub-menu nav-content ${isOpen ? "expanded" : ""}`}
        style={{
          height: isOpen ? contentRef.current?.scrollHeight : 0,
          display: "block",
        }}
      >
        {navitem.items.map((item) => (
          <li
            className={`nav-item ${
              item.path == location.pathname ? "active" : ""
            }`}
            key={item.key}
          >
            <Link to={item.path} className="nav-link ">
              {" "}
              <span className="title">{item.text}</span>
              <span className="selected"></span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export const Sidebar = ({ names, title }) => {
  const [menuItems, setMenuItems] = useState(navigation);
  const location = useLocation();

  return (
    /* start sidebar menu */
    <div className="sidebar-container">
      <div className="sidemenu-container navbar-collapse collapse fixed-menu">
        <div id="remove-scroll" className="left-sidemenu">
          <div
            className="slimScrollDiv"
            style={{
              position: "relative",
              overflow: "hidden",
              width: "auto",
              height: "874px",
            }}
          >
            <ul
              className="sidemenu page-header-fixed slimscroll-style"
              data-keep-expanded="false"
              data-auto-scroll="true"
              data-slide-speed="200"
              style={{
                paddingTop: "20px",
                overflow: "hidden",
                width: "auto",
                height: "874px",
              }}
            >
              <li className="sidebar-toggler-wrapper hide" key={"toggle"}>
                <div className="sidebar-toggler">
                  <span></span>
                </div>
              </li>
              {menuItems.map((navitem) => {
                if (navitem.items.length == 0) {
                  return (
                    <li
                      className={
                        navitem.path == location.pathname ? "active" : ""
                      }
                      key={navitem.key}
                    >
                      <Link to={navitem.path} className="nav-link">
                        <i className={navitem.icon}></i>
                        <span className="title">{navitem.text}</span>
                      </Link>
                    </li>
                  );
                } else {
                  return <ExpandableGroup navitem={navitem}></ExpandableGroup>;
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
