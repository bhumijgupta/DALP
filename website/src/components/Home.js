import React, { Component } from "react";
import LoginCard from "./LoginCard";
import TeachingImage from "../assets/teaching.svg";
import "./Home.css";
import GradientContainer from "./GradientContainer";
import BrandHeader from "./BrandHeader";

export class Home extends Component {
  render() {
    return (
      <div className="home">
        <GradientContainer>
          <BrandHeader />
          <div className="row">
            <div className="col-md-12 sm-image text-center">
              <img src={TeachingImage} alt="Teaching vector"></img>
            </div>
            <div className="col-md-6 col-sm-12 text-center" id="teacher">
              <LoginCard type="Teacher" />
            </div>
            <div className="col-md-6 col-sm-12 text-center" id="student">
              <LoginCard type="Student" />
            </div>
          </div>
        </GradientContainer>
      </div>
    );
  }
}

export default Home;
