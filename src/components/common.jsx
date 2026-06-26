import React from "react";

export function DetailBlock({ label, value }) {
  return (
    <div className="detail-block">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function SectionTitle({ icon, title }) {
  return (
    <div className="section-title">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

export function Metric({ value, label }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
