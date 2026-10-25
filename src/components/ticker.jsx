import React from "react";
import Assist from "../classes/assist";
import './ticker.css'

// icon: a Font Awesome class such as "fa fa-money" (optional)
export const Ticker = ({ title, value, color, icon }) => {

  return (
    /* start ticker */
    <div className="card comp-card">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col">
            <div className="ticker-head">
              <h4 className="info-box-title">{title}</h4>
              {icon && (
                <span className={`ticker-icon l-bg-${color}`} aria-hidden="true">
                  <i className={icon}></i>
                </span>
              )}
            </div>
            <h3 className={`mt-1 mb-1 info-box-title col-${color}`} title={value}>
              {/* may break between the currency and the amount, never inside the amount */}
              {String(value).split(/[\s ]+/).map((part, i) => (
                <React.Fragment key={i}>
                  {i ? " " : ""}
                  <span className="ticker-part">{part}</span>
                </React.Fragment>
              ))}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
