import React, { Component } from "react";
import GradientContainer from "./GradientContainer";
import BrandHeader from "./BrandHeader";
import "./LoadingPermission.css";

export class LoadingPermission extends Component {
  getContent = () => {
    if (this.props.loading === null) {
      return (
        <>
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">
              Allow webcam permission on this page
            </span>
          </div>
          <div>Allow webcam permission on this page</div>
        </>
      );
    } else {
      return <div>Webcam permission required to access this page</div>;
    }
  };
  render() {
    return (
      <div className="loading-permission">
        <GradientContainer>
          <BrandHeader />
          <div className="row">
            <div className="col"></div>
            <div className="col-md-6 com-sm-12">
              <div className="title text-center">{this.getContent()}</div>
            </div>
            <div className="col"></div>
          </div>
        </GradientContainer>
      </div>
    );
  }
}

export default LoadingPermission;
