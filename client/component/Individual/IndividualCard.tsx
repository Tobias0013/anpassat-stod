import React from "react";
import "./IndividualCard.css";

type IndividualCardProps = {
  name: string;
};

export default function IndividualCard({ name }: IndividualCardProps) {
  return (
    <div className="individual-card">
      <div className="circle">
        <span className="name">{name}</span>
      </div>
    </div>
  );
}
