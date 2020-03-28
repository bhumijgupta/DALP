import React, { Component } from "react";
import "./WhiteBtnOutline.css";

class WhiteBtnOutline extends Component {
  state = {
    hover: false
  };

  render() {
    return (
      <button
        onMouseEnter={() => {
          this.setState({ hover: true });
        }}
        onMouseLeave={() => {
          this.setState({ hover: false });
        }}
        className={
          this.state.hover === false
            ? "btn btn-md btn-outline-light white-btn-outline"
            : "btn btn-md btn-outline-light white-btn-outline btnHover"
        }
        {...this.props}
      >
        <b>{this.props.children}</b>
      </button>
    );
  }
}

export default WhiteBtnOutline;
