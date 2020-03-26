import React, { Component } from "react";
import LoginCard from "./LoginCard";
import TeachingImage from "../assets/teaching.svg";
import "./Home.css";

export class Home extends Component {
  state = {};

  render() {
    return (
      <div className="home">
        <div className="container vh100 flex-center vert-flex">
          <div className="row">
            <div className="text-center header noselect">
              <span className="brand">
                D<span>A</span>L P
              </span>
              <br />
              Distance Academic Learning Portal
            </div>
          </div>
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
        </div>
      </div>
    );
  }
}

export default Home;
