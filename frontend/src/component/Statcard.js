import React from "react";

function Statcard({ title, value, icon, color = "indigo", trend, subtext }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-card-header">
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <h3 className="stat-value">{value}</h3>
        </div>
        <div className={`stat-icon-wrapper icon-${color}`}>
          {icon}
        </div>
      </div>
      {(trend || subtext) && (
        <div className="stat-card-footer">
          {trend && <span className="stat-trend badge-success">↑ {trend}</span>}
          {subtext && <span className="stat-subtext">{subtext}</span>}
        </div>
      )}
    </div>
  );
}

export default Statcard;
