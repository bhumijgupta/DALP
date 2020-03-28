import React from "react";
import "./GradientContainer.css";

function GradientContainer(props) {
  return (
    <div className="gradient-container">
      <div className="container vh100 flex-center vert-flex">
        {props.children}
      </div>
    </div>
  );
}

export default GradientContainer;
