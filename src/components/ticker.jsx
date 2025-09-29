import React from "react";

export const Ticker = ({ title, value, color, percent }) => {
  // Currency formatting
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ZMW",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    /* start ticker */
    <div className="card comp-card">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col">
            <div className="col mt-0">
              <h4 className="info-box-title">{title}</h4>
            </div>
            <h3 className={`mt-1 mb-3 info-box-title col-${color}`}>
              {currencyFormatter.format(value)}
            </h3>
            <div className="progress">
              <div
                className={`progress-bar l-bg-${color}`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
