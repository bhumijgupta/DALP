import Webcam from "react-webcam";

import React, { Component } from "react";

const videoConstraints = {
  width: 350,
  height: 350,
  facingMode: "user"
};

export class WebcamStudent extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
  }
  key = null;
  capture = () => {
    const imageSrc = this.webcam.current.getScreenshot();
    // Send to parent
    this.props.getImage(imageSrc);
  };

  componentDidMount = () => {
    this.key = setInterval(this.capture, 500);
    // setTimeout(this.capture(), 1000);
  };

  componentWillUnmount = () => {
    if (this.key !== null) {
      clearInterval(this.key);
    }
  };

  render() {
    return (
      <div className="webcam-student">
        <Webcam
          ref={this.webcam}
          videoConstraints={videoConstraints}
          screenshotFormat="image/jpeg"
        />
      </div>
    );
  }
}

export default WebcamStudent;
