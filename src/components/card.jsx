import React from "react";

export const Card = ({ title, children }) => {
  return (
    <div className="card">
      <div className="card-head">
        <header>{title}</header>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
};

