import React, { Component } from "react";
import "./Video.css";

export class Video extends Component {
  constructor(props) {
    super(props);
    this.vidRef = React.createRef();
  }

  componentDidUpdate = () => {
    this.vidRef.current.srcObject = this.props.src;
  };

  render() {
    return (
      <div
        className={
          "embed-responsive video-component rounded-lg " + this.props.size
        }
        style={{ height: this.props.height }}
      >
        <video
          className="embed-responsive-item"
          ref={this.vidRef}
          autoPlay
          muted
          id="video"
        />
      </div>
    );
  }
}

export default Video;
