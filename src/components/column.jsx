import React from "react";

export const Col = ({ lg, md, sm, size, children }) => {
  return (
    <div className="col-12 col-sm-12 col-lg-6">
      {children}
    </div>
  );
};
