// import React, { useRef } from "react";
import "./Video.css";
// function Video(props) {
//   const videoRef = useRef();
//   if (props.src && videoRef.current && !videoRef.current.srcObject) {
//     videoRef.current.srcObject = props.src;
//   }
//   return (
//     <div className="embed-responsive embed-responsive-4by3">
//       <video className="embed-responsive-item" ref={videoRef} autoPlay muted />
//     </div>
//   );
// }

import React, { Component } from "react";

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
        className={"embed-responsive " + this.props.size}
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
