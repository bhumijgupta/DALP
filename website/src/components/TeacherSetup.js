import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import LoadingPermission from "./LoadingPermission";
import NavBar from "./NavBar";
import Video from "./Video";

export class TeacherSetup extends Component {
  state = {
    permission: null,
    stream: null
  };

  componentDidMount = () => {
    if (this.props.TeacherAuth === true) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true
        })
        .then(stream => {
          stream.getTracks().forEach(track => {
            track.stop();
          });
          this.setState({ permission: true });
        })
        .catch(err => {
          this.setState({ permission: false });
        });
    }
  };

  render() {
    // If no techer auther present, redirect to /teacher
    if (this.props.TeacherAuth === false) {
      return <Redirect to="/teacher" />;
    }
    // loading if permission not granted or loading
    else if (this.state.permission !== true) {
      return <LoadingPermission loading={this.state.permission} />;
    }
    // Redirect to dashboard page if permission is done
    else if (this.state.permission === true) {
      return <Redirect to="/teacher/dashboard"></Redirect>;
    }
    // TODO: implement feature of choosing video and sudio source
    return (
      <div className="teacher-setup vh100">
        <NavBar name={this.props.TeacherState.name} />
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <Video src={this.state.stream} />
            </div>
            <div className="col-md-4"></div>
          </div>
          <form className="row">
            <div className="form-group col-md-6">
              <label>Video source</label>
              <select onChange={this.onVideoChange} className="form-control">
                {this.getVedioDevicesList()}
              </select>
            </div>
            <div className="form-group col-md-6">
              <label>Audio source</label>
              <select onChange={this.onAudioChange} className="form-control">
                {this.getAudioDevicesList()}
              </select>
            </div>
            <div className="col-md">
              <button className="btn btn-md btn-primary">Continue</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default TeacherSetup;
