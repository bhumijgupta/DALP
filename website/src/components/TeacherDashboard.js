import React, { Component } from "react";
import NavBar from "./NavBar";
import "./TeacherDashboard.css";
import Video from "./Video";
import Peer from "peerjs";

export class TeacherDashboard extends Component {
  state = {
    stream: null,
    view: "activity"
  };

  componentDidMount = () => {
    //Initialising the peer
    const peer = new Peer(this.props.TeacherState.courseId, {
      host: "localhost",
      port: 8080,
      path: "/myapp"
    });
    console.log(this.props.TeacherState.courseId);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        console.log("Teacher Streaming successfully.");
        //Setting teacher's video
        this.setState({ stream });
      })
      .catch(err => {
        //If teacher hasn't given the permission
        //TODO:Error component
        console.log("Error accessing teacher's stream.", err);
      });
    //Asking the teacher to respond to the student call
    peer.on("call", call => {
      console.log("Student called the teacher !!");
      //Sending the stream back
      call.answer(this.state.stream);
    });
  };

  render() {
    return (
      <div className="teacher-dashboard">
        <NavBar name={this.props.TeacherState.name} />
        <div className="container content">
          <div className="row">
            <div className="col-md-8">
              <h2>{this.props.TeacherState.courseName}</h2>
              <Video src={this.state.stream} size="embed-responsive-16by9" />
            </div>
            <div className="col-md-4">
              <h3>Activities</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TeacherDashboard;
