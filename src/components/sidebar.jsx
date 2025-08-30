import React from "react";
import { Link } from "react-router-dom";

export const Sidebar = ({ names, title }) => {
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
              <li className="sidebar-toggler-wrapper hide">
                <div className="sidebar-toggler">
                  <span></span>
                </div>
              </li>
              <li className="sidebar-user-panel">
                <div className="sidebar-user">
                  <div className="sidebar-user-picture">
                    <img alt="image" src="./images/dp.jpg" />
                  </div>
                  <div className="sidebar-user-details">
                    <div className="user-name">{names}</div>
                    <div className="user-role">{title}</div>
                  </div>
                </div>
              </li>
              <li className="nav-item start active open">
                <a
                  href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                  className="nav-link nav-toggle"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-airplay"
                  >
                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                    <polygon points="12 15 17 21 7 21 12 15"></polygon>
                  </svg>
                  <span className="title">Dashboard</span>
                  <span className="selected"></span>
                  <span className="arrow open"></span>
                </a>
                <ul className="sub-menu">
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                      <span className="title">Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/about" className="nav-link">
                      <span className="title">About</span>
                    </Link>
                  </li>
                  <li className="nav-item active">
                    <Link to="/contact" className="nav-link">
                      <span className="title">Contact</span>
                      <span className="selected"></span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  href="https://www.einfosoft.com/templates/admin/smart/source/light/event.html"
                  className="nav-link nav-toggle"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-calendar"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="title">Event Management</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                  className="nav-link nav-toggle"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-book"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <span className="title">Courses</span>
                  <span className="arrow"></span>
                  <span className="label label-rouded label-menu label-success">
                    new
                  </span>
                </a>
                <ul className="sub-menu">
                  <li className="nav-item">
                    <a
                      href="https://www.einfosoft.com/templates/admin/smart/source/light/all_courses.html"
                      className="nav-link"
                    >
                      <span className="title">All Courses</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="https://www.einfosoft.com/templates/admin/smart/source/light/add_course.html"
                      className="nav-link"
                    >
                      <span className="title">Add Course</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="https://www.einfosoft.com/templates/admin/smart/source/light/add_course_bootstrap.html"
                      className="nav-link"
                    >
                      <span className="title">Add Course Bootstrap</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="https://www.einfosoft.com/templates/admin/smart/source/light/edit_course.html"
                      className="nav-link"
                    >
                      <span className="title">Edit Course</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="https://www.einfosoft.com/templates/admin/smart/source/light/course_details.html"
                      className="nav-link"
                    >
                      <span className="title">About Course</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a href="javascript:;" className="nav-link nav-toggle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-chevrons-down"
                  >
                    <polyline points="7 13 12 18 17 13"></polyline>
                    <polyline points="7 6 12 11 17 6"></polyline>
                  </svg>
                  <span className="title">Multi Level Menu</span>
                  <span className="arrow"></span>
                </a>
                <ul className="sub-menu">
                  <li className="nav-item">
                    <a href="javascript:;" className="nav-link nav-toggle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-alert-octagon"
                      >
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      Item 1<span className="arrow"></span>
                    </a>
                    <ul className="sub-menu">
                      <li className="nav-item">
                        <a href="javascript:;" className="nav-link nav-toggle">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-aperture"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line
                              x1="14.31"
                              y1="8"
                              x2="20.05"
                              y2="17.94"
                            ></line>
                            <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
                            <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
                            <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
                            <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
                            <line
                              x1="16.62"
                              y1="12"
                              x2="10.88"
                              y2="21.94"
                            ></line>
                          </svg>
                          Arrow Toggle
                          <span className="arrow"></span>
                        </a>
                        <ul className="sub-menu">
                          <li className="nav-item">
                            <a href="javascript:;" className="nav-link">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-battery"
                              >
                                <rect
                                  x="1"
                                  y="6"
                                  width="18"
                                  height="12"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <line x1="23" y1="13" x2="23" y2="11"></line>
                              </svg>
                              Sample Link 1
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                              className="nav-link"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-award"
                              >
                                <circle cx="12" cy="8" r="7"></circle>
                                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                              </svg>
                              Sample Link 2
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                              className="nav-link"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-box"
                              >
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                              </svg>
                              Sample Link 3
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li className="nav-item">
                        <a
                          href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                          className="nav-link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-clock"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          Sample Link 1
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                          className="nav-link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-database"
                          >
                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                          </svg>
                          Sample Link 2
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                          className="nav-link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-edit"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Sample Link 3
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a href="javascript:;" className="nav-link nav-toggle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-folder"
                      >
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Arrow Toggle
                      <span className="arrow"></span>
                    </a>
                    <ul className="sub-menu">
                      <li className="nav-item">
                        <a
                          href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                          className="nav-link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-film"
                          >
                            <rect
                              x="2"
                              y="2"
                              width="20"
                              height="20"
                              rx="2.18"
                              ry="2.18"
                            ></rect>
                            <line x1="7" y1="2" x2="7" y2="22"></line>
                            <line x1="17" y1="2" x2="17" y2="22"></line>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <line x1="2" y1="7" x2="7" y2="7"></line>
                            <line x1="2" y1="17" x2="7" y2="17"></line>
                            <line x1="17" y1="17" x2="22" y2="17"></line>
                            <line x1="17" y1="7" x2="22" y2="7"></line>
                          </svg>
                          Sample Link 1
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                          className="nav-link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-file"
                          >
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                          </svg>
                          Sample Link 1
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                          className="nav-link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-heart"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          Sample Link 1
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a
                      href="https://www.einfosoft.com/templates/admin/smart/source/light/dashboard3.html#"
                      className="nav-link"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-lock"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Item 3
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <div
              className="slimScrollBar"
              style={{
                background: "rgb(158, 165, 171)",
                width: "5px",
                position: "absolute",
                top: "0px",
                opacity: "0.4",
                display: "none",
                borderRadius: "7px",
                zIndex: "99",
                right: "1px",
                height: "489.978px",
              }}
            ></div>
            <div
              className="slimScrollRail"
              style={{
                width: "5px",
                height: "100%",
                position: "absolute",
                top: "0px",
                display: "none",
                borderRadius: "7px",
                background: "rgb(51, 51, 51)",
                opacity: "0.2",
                zIndex: "90",
                right: "1px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
