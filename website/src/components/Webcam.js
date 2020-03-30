import WebcamReact from "react-webcam";

import React, { Component } from "react";

export class Webcam extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
  }
  static defaultProps = {
    interval: null,
    forceScreenshotSourceSize: false,
    screenshotFormat: "image/png",
    screenshotQuality: 1,
    getImage: () => {},
    width: 350,
    height: 350
  };
  key = null;
  capture = () => {
    const imageSrc = this.webcam.current.getScreenshot();
    // Send to parent
    this.props.getImage(imageSrc);
  };

  componentDidMount = () => {
    if (this.props.interval)
      this.key = setInterval(this.capture, this.props.interval);
  };

  componentWillUnmount = () => {
    if (this.key !== null) {
      clearInterval(this.key);
    }
  };

  render() {
    return (
      <div className="webcam-student">
        <WebcamReact
          ref={this.webcam}
          videoConstraints={{
            width: this.props.width,
            height: this.props.height
          }}
          screenshotFormat={this.props.screenshotFormat}
          screenshotQuality={this.props.screenshotQuality}
          forceScreenshotSourceSize={this.props.forceScreenshotSourceSize}
        />
      </div>
    );
  }
}

export default Webcam;
