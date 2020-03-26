import React from "react";
import { Link } from "react-router-dom";
import "./LoginCard.css";
import professorImage from "../assets/professor.svg";
import studentImage from "../assets/student.svg";

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
          <button
            onMouseEnter={() => {
              this.setState({ hover: true });
            }}
            onMouseLeave={() => {
              this.setState({ hover: false });
            }}
            className={
              this.state.hover === false
                ? "btn btn-md btn-outline-light"
                : "btn btn-md btn-outline-light btnHover"
            }
          >
            <b>Continue as {this.props.type}</b>
          </button>
        </Link>
      </div>
    );
  }
}

export default LoginCard;
