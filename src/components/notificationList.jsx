import React from "react";

export const NotificationList = (items) => {
  return (
    /* list */
    <div
      className="notification-list mail-list not-list small-slimscroll-style"
      style={{ width: "auto" }}
    >
      <a href="#" className="single-mail">
        <span className="icon bg-primary">
          <i className="fa fa-user-o"></i>
        </span>
        <span className="text-purple">Abhay Jani</span> Added you as friend
        <span className="notificationtime">
          <small>Just Now</small>
        </span>
      </a>
      <a href="#" className="single-mail">
        <span className="icon blue-bgcolor">
          <i className="fa fa-envelope-o"></i>
        </span>
        <span className="text-purple">John Doe</span> send you a mail
        <span className="notificationtime">
          <small>Just Now</small>
        </span>
      </a>
      <a href="#" className="single-mail">
        <span className="icon bg-success">
          <i className="fa fa-check-square-o"></i>
        </span>
        Success Message
        <span className="notificationtime">
          <small> 2 Days Ago</small>
        </span>
      </a>

      <div className="full-width text-center p-t-10">
        <button
          type="button"
          className="btn purple btn-outline btn-circle margin-0"
        >
          View All
        </button>
      </div>
    </div>
  );
};
