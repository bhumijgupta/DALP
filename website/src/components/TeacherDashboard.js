import React, { Component } from "react";
import NavBar from "./NavBar";
import "./TeacherDashboard.css";
import Video from "./Video";

export class TeacherDashboard extends Component {
  state = {
    stream: null,
    view: "activity"
  };

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true
      })
      .then(stream => {
        this.setState({ stream });
      });
  }

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
