import React, { Component } from "react";
import Video from "./Video";
import Peer from "peerjs";
import NavBar from "./NavBar";
import "./StudentDashboard.css";
import Transcript from "./Transcript";
import QuizView from "./QuizView";
import io from "socket.io-client";
export class StudentDashboard extends Component {
  state = {
    myStream: null,
    remoteStream: null,
    slowConnection: false,
    marks: null,
    showQuiz: false,
    socket: null,
    socketSet: false
  };

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
    //Initialising the socket and setting the state to be used anywhere
    const socket = io(`http://localhost:8081`);
    this.setState({ socket, socketSet: true });
    console.log("socket init");
    console.log("peer initialized");
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        //IMPORTANT: DO NOT SET ANY STATE BEFORE THIS
        this.setState({ socketSet: false });
        //Setting student's stream
        this.setState({ myStream: stream });
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
    //socket.emit("s-test", "Hello I am student");
  };
  componentDidUpdate = () => {
    if (this.state.socketSet) {
      this.state.socket.emit("join-room", {
        room: this.props.StudentState.courseId,
        username: this.props.StudentState.name
      });
      this.state.socket.on("r-test", data => {
        console.log("Testing socket ", data);
      });
      console.log("Student joined the room.");
      console.log("Student listening.");
    }
  };
  submitMarks = marks => {
    this.setState({ marks, showQuiz: false });
  };

  showImage = () => {
    if (this)
      return (
        <>
          <h3>Image feed</h3>
          <div className="text-muted mb-2">Image refreshed every 3 sec</div>
          <div className="image">
            <img
              src="https://via.placeholder.com/720/480"
              className="img-fluid rounded"
              alt="live screenshot"
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
    if (this.state.showQuiz) {
      return (
        <QuizView
          submitMarks={this.submitMarks}
          questions={this.props.TeacherState.quiz}
          title={this.props.TeacherState.quizTitle}
        />
      );
    }
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
