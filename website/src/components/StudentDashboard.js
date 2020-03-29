import React, { Component } from "react";
import Video from "./Video";
import Peer from "peerjs";
import NavBar from "./NavBar";
import "./StudentDashboard.css";
import Transcript from "./Transcript";

export class StudentDashboard extends Component {
  state = { myStream: null, remoteStream: null, slowConnection: false };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.slowConnection === true &&
      this.state.remoteStream !== null
    ) {
      this.setState({ remoteStream: null });
    }
  }

  componentDidMount = () => {
    //Initiating a peer
    var peer = new Peer(null, {
      host: "localhost",
      port: 8080,
      path: "/myapp"
    });
    console.log("peer initialized");
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        //Setting student's stream
        this.setState({ myStream: stream });
        console.log(this.props.StudentState.courseId);
        // let npeer = peer.connect(this.props.StudentState.courseId);
        // npeer.on("open", () => {
        //   console.log("connected");
        // });
        // npeer.on("data", () => {
        //   console.log("data recieved");
        //   var call = peer.call(this.props.StudentState.courseId, stream);
        //   call.on("stream", remoteStream => {
        //     //Setting remoteStream i.e teacher's stream
        //     console.log("Teacher stream reached");
        //     this.setState({ remoteStream });
        //   });
        // });
        var call = peer.call(this.props.StudentState.courseId, stream);
        call.on("stream", remoteStream => {
          //Setting remoteStream i.e teacher's stream
          console.log("Teacher stream reached");
          this.setState({ remoteStream });
        });
      })
      .catch(err => {
        //TODO:Error component
        console.log("Error while streaming student's stream.", err);
      });
  };
  showImage = () => {
    return (
      <>
        <h3>Image feed</h3>
        <div className="text-muted mb-2">Image refreshed every 3 sec</div>
        <div className="image">
          <img
            src="https://via.placeholder.com/720/480"
            className="img-fluid rounded"
            alt="image feed"
          />
        </div>
      </>
    );
  };
  showStream = () => {
    return (
      <>
        <h3 className="mb-2">Course video</h3>
        <Video src={this.state.remoteStream} size="embed-responsive-16by9" />
        <div
          className="text-muted text-center mt-2 slow-con-btn"
          onClick={() => {
            this.setState({ slowConnection: true });
          }}
        >
          <u className="col-blue">Slow connection? Switch to low data mode</u>
        </div>
      </>
    );
  };

  getImage = src => {
    console.log("recieved");
  };
  render() {
    return (
      <div className="student-dashboard mb-3">
        <NavBar name={this.props.StudentState.name} />
        <div className="container content">
          <div className="row">
            <div className="col-md">
              {this.state.slowConnection ? this.showImage() : this.showStream()}
            </div>
            <Transcript showTranscript={this.state.slowConnection} />
          </div>
        </div>
      </div>
    );
  }
}

export default StudentDashboard;
