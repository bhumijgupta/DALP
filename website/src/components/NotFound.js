import React from "react";
import { Link } from "react-router-dom";

import WhiteBtnOutline from "./WhiteBtnOutline";
import GradientContainer from "./GradientContainer";
import BrandHeader from "./BrandHeader";

// TODO: Add vector and center this
function NotFound() {
  return (
    <GradientContainer>
      <BrandHeader />
      <div className="row">
        <div className="col-md"></div>
        <div className="col-md-6">
          <div className="title"> 404 </div>
          <div className="subtext">Page not found</div>
          <Link to="/">
            <WhiteBtnOutline>Go to homepage</WhiteBtnOutline>
          </Link>
        </div>
        <div className="col-md"></div>
      </div>
    </GradientContainer>
  );
}

export default NotFound;
