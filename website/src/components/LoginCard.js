import React from "react";
import { Link } from "react-router-dom";
import "./LoginCard.css";
import professorImage from "../assets/professor.svg";
import studentImage from "../assets/student.svg";
import WhiteBtnOutline from "./WhiteBtnOutline";

class LoginCard extends React.Component {
  state = { hover: false };
  render() {
    return (
      <div className="login-card">
        <div>
          <img
            src={this.props.type === "Teacher" ? professorImage : studentImage}
            alt={this.props.type + " image"}
          ></img>
        </div>
        <Link to={"/" + this.props.type.toLowerCase()}>
          <WhiteBtnOutline>
            Continue as {this.props.type.toLowerCase()}
          </WhiteBtnOutline>
        </Link>
      </div>
    );
  }
}

export default LoginCard;
