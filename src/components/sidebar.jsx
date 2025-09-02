import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { navigation } from "../navigation/app-navigation";

export const Sidebar = ({ names, title }) => {
  const [menuItems, setMenuItems] = useState(navigation);
  const location = useLocation();

  const isChildActive = (navItem) => {
    const mItem = navItem.items.find((menu) => menu.path == location.pathname);

    return mItem != undefined;
  };

  const getNavClass = (navItem) => {
    return navItem.isOpen || isChildActive(navItem)
      ? "nav-item open"
      : "nav-item";
  };

  const getSubDispay = (navItem) => {
    return navItem.isOpen || isChildActive(navItem) ? "block" : "none";
  };

  const getItemClass = (navItem) => {
    return navItem.path == location.pathname ? "nav-item active" : "nav-item";
  };

  const getArrowClass = (navItem) => {
    return navItem.isOpen || isChildActive(navItem) ? "arrow open" : "arrow";
  };

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
                    <li className={getItemClass(navitem)} key={navitem.key}>
                      <Link to={navitem.path} className="nav-link">
                        <i className={navitem.icon}></i>
                        <span className="title">{navitem.text}</span>
                      </Link>
                    </li>
                  );
                } else {
                  return (
                    <li
                      className={getNavClass(navitem)}
                      key={navitem.key}
                      onClick={() => {
                        const list = menuItems.map((itm) => {
                          itm.isOpen = itm.key == navitem.key;

                          return itm;
                        });

                        setMenuItems(list);
                      }}
                    >
                      <Link to={navitem.path} className="nav-link nav-toggle">
                        {" "}
                        <i className={navitem.icon}></i>
                        <span className="title">{navitem.text}</span>
                        <span className="selected"></span>
                        <span className={getArrowClass(navitem)}></span>
                      </Link>
                      <ul
                        className="sub-menu"
                        style={{ display: getSubDispay(navitem) }}
                      >
                        {navitem.items.map((item) => (
                          <li className={getItemClass(item)} key={item.key}>
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
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
