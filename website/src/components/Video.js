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

  componentDidMount() {
    if (this.props.returnRef !== null) this.props.returnRef(this.vidRef);
  }

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

Video.defaultProps = {
  returnRef: null
};

export default Video;
