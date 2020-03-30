import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import LoadingPermission from "./LoadingPermission";
import "./StudentSetup.css";
import GradientContainer from "./GradientContainer";
import BrandHeader from "./BrandHeader";
import Webcam from "./Webcam";
import { loadModel, detectFaces } from "../utils/faceapi";

export class StudentSetup extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  state = {
    permission: null,
    faceDetect: false
  };

  componentDidMount = async () => {
    await loadModel();
    // If user is authenticated, get permission for webcam
    if (this.props.StudentAuth === true && !this.state.permission) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: "user" }
        })
        .then(stream => {
          // Set permission to true
          stream.getTracks().forEach(track => {
            track.stop();
          });
          this.setState({ permission: true });
        })
        // Catch if permission is denied
        .catch(err => {
          this.setState({ permission: false });
        });
    }
  };

  getImage = async imageSrc => {
    const ctx = this.canvas.current.getContext("2d");
    // The saviour filter
    ctx.filter = "130%";
    var image = new Image();
    // Draw on canvas and use canvas to detect face
    image.onload = async () => {
      ctx.drawImage(image, 0, 0, 350, 350);
      let resp = await detectFaces("canvas");
      console.log(resp);
      // If face detected, change state and redirect to /student/dashboard
      if (resp) {
        this.setState({ faceDetect: true });
      }
    };
    image.src = imageSrc;
  };

  render() {
    // If no student auth present, redirect to /student
    if (this.props.StudentAuth === false) {
      return <Redirect to="/student" />;
    }
    // loading if permission not granted or loading
    if (this.state.permission !== true) {
      return <LoadingPermission loading={this.state.permission} />;
    }
    // If face detected, redirect to dashboard
    if (this.state.faceDetect) {
      return <Redirect to="/student/dashboard" />;
    }
    // Render Proctoring
    return (
      <div className="student-setup">
        <GradientContainer>
          <BrandHeader />
          <div className="row">
            <div className="col"></div>
            <div className="col-md-6 com-sm-12 text-center">
              <div className="title text-center">Proctoring</div>
              <br />
              <Webcam interval={500} getImage={this.getImage} />
              <br />
              <b>Status: Cannot find face</b>
              <br />
              Please make sure you are in a well lit environment
              <canvas ref={this.canvas} id="canvas"></canvas>
            </div>
            <div className="col"></div>
          </div>
        </GradientContainer>
      </div>
    );
  }
}

export default StudentSetup;
