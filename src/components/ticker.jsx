import React from "react";

export const Ticker = ({ title, value, color, percent }) => {
  return (
    /* start ticker */
    <div className="card comp-card">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col">
            <div className="col mt-0">
              <h4 className="info-box-title">{title}</h4>
            </div>
            <h3 className="mt-1 mb-3 info-box-title col-green">{value}</h3>
            <div className="progress">
              <div
                className={`progress-bar l-bg-${color}`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
          <div className="col-auto">
            <div id="sparkline9">
              <canvas
                width="100"
                height={percent}
                style={{
                  display: "inline-block",
                  width: "100px",
                  height: `${percent}px`,
                  verticalAlign: "top",
                }}
              ></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
