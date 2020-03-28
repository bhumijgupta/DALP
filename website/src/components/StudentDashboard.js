import React, { Component } from "react";
import Video from "./Video";
import Peer from "peerjs";

export class StudentDashboard extends Component {
  state = { myStream: null, remoteStream: null };
  componentDidMount = () => {
    //Initiating a peer
    var peer = new Peer(null, {
      host: "localhost",
      port: 8080,
      path: "/myapp"
    });
    console.log("peer initialized");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        //Setting student's stream
        this.setState({ myStream: stream });
        console.log(this.props.StudentState.courseId);
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
  render() {
    return (
      <div>
        <h1>My Feed :</h1>
        <Video src={this.state.myStream} size="embed-responsive-16by9" />
        <h1>Teacher's Feed</h1>
        <Video src={this.state.remoteStream} size="embed-responsive-16by9" />
      </div>
    );
  }
}

export default StudentDashboard;
