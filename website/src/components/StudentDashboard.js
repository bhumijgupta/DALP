import React, { Component } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";

import NavBar from "./NavBar";
import Video from "./Video";
import QuizView from "./QuizView";
import SpeechTextArea from "./SpeechTextArea";

import "./StudentDashboard.css";

export class StudentDashboard extends Component {
  state = {
    myStream: null,
    remoteStream: null,
    slowConnection: false,
    showQuiz: false,
    socket: null,
    socketSet: false,
    quiz: [],
    quizTitle: "",
    imgSrc:
      "https://via.placeholder.com/720x480/2267C2/FFFFFF/?text=Fetching+images+...+Please+wait",
    pdfFile: null,
    peer: null,
    transcripts: "", // r-trans -> append the text to this
    partial: "", //r-partial-> update this to the text, r-trans -> ""
    teacherLeft: false,
  };

  componentDidMount = () => {
    //Initiating a peer
    var peer = new Peer(null, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });
    //Initialising the socket and setting the state to be used anywhere
    const socket = io(`http://localhost:8080`);
    this.setState({ socket, socketSet: true }, () => {
      this.state.socket.on("r-partial", (partial) => {
        this.setState({
          partial: partial,
        });
      });

      this.state.socket.on("r-trans", (trans) => {
        this.setState({
          transcripts: (this.state.transcripts + " " + trans).trim(),
          partial: "",
        });
      });

      this.state.socket.on("r-link", (pdfFile) => {
        this.setState({ pdfFile });
      });

      this.state.socket.on("t-left", () => {
        this.cleanup();
        this.setState({ teacherLeft: true });
      });
    });
    console.log("socket init");
    console.log("peer initialized");
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        //IMPORTANT: DO NOT SET ANY STATE BEFORE THIS
        this.setState({ socketSet: false });
        //Setting student's stream
        this.setState({ myStream: stream, peer });
        // If r-call recieved, call teacher
        socket.on("r-call", () => {
          console.log("calling teacher");
          var call = this.state.peer.call(
            this.props.StudentState.courseId,
            this.state.myStream
          );
          call.on("stream", (remoteStream) => {
            //Setting remoteStream i.e teacher's stream
            console.log("Teacher stream reached");
            this.setState({ remoteStream });
          });
        });
      })
      .catch((err) => {
        //TODO:Error component
        console.log("Error while streaming student's stream.", err);
      });
    //socket.emit("s-test", "Hello I am student");
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.state.slowConnection === true &&
      this.state.remoteStream !== null
    ) {
      // Set incoming stream to null
      this.setState({ remoteStream: null });
      // Start listening for incoming images
      this.state.socket.on("r-image", (img) => {
        let imgNew = new Blob([img]);
        this.setState({ imgSrc: URL.createObjectURL(imgNew) });
      });
    }
    if (this.state.socketSet) {
      this.state.socket.emit("join-room", {
        room: this.props.StudentState.courseId,
        username: this.props.StudentState.name,
      });
      // listen for quiz start
      this.state.socket.on("r-quiz", (quiz) => {
        this.setState({
          showQuiz: true,
          quiz: quiz.quiz,
          quizTitle: quiz.title,
        });
      });
      this.state.socket.on("r-test", (data) => {
        console.log("Testing socket ", data);
      });
      console.log("Student joined the room.");
      console.log("Student listening.");
    }
  };
  submitMarks = (marks) => {
    // send quiz marks
    this.state.socket.emit("r-quiz-submit", {
      name: this.props.StudentState.name,
      marks,
    });
    // revert to normal stream
    this.setState({ showQuiz: false });
  };

  showImage = () => {
    if (this)
      return (
        <>
          <h3>Image feed</h3>
          <div className="text-muted mb-2">Image refreshed every 3 sec</div>
          <div className="image">
            <img
              src={this.state.imgSrc}
              className="img-fluid rounded"
              alt="live screenshot"
            />
          </div>
        </>
      );
  };

  // Cleanup resources
  cleanup = async () => {
    if (this.state.myStream) {
      let tracks = await this.state.myStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
    if (this.state.peer) {
      this.state.peer.destroy();
    }
    if (this.state.socket) {
      this.state.socket.close();
    }
    this.setState({
      myStream: null,
      showQuiz: false,
      socket: null,
      remoteStream: null,
      peer: null,
    });
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
          {this.state.pdfFile === null && (
            <u className="col-blue">Slow connection? Switch to low data mode</u>
          )}
        </div>
      </>
    );
  };

  showAlert = () => {
    if (!this.state.teacherLeft) return null;
    return (
      <div className="row">
        <div className="col-md">
          <div className="alert alert-primary" role="alert">
            Teacher left the class! Thank you for attending the course.
          </div>
        </div>
      </div>
    );
  };

  render() {
    // If user not authenticated
    if (!this.props.StudentAuth) {
      return <Redirect to="/student" />;
    }
    // If showQuiz
    if (this.state.showQuiz) {
      return (
        <QuizView
          submitMarks={this.submitMarks}
          questions={this.state.quiz}
          title={this.state.quizTitle}
        />
      );
    }
    // else
    return (
      <div className="student-dashboard mb-3">
        <NavBar
          name={this.props.StudentState.name}
          dashboardTitle={"Student Dashboard"}
        />
        <div className="container content">
          {this.showAlert()}
          <div className="row">
            <div className="col-md">
              {this.state.slowConnection ? this.showImage() : this.showStream()}
            </div>
            {this.state.slowConnection && (
              <SpeechTextArea
                phrase={this.state.transcripts + " " + this.state.partial}
              />
            )}
          </div>
          {this.state.pdfFile !== null && (
            <div className="row">
              <div className="col-md text-center">
                <a
                  href={this.state.pdfFile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="btn btn-primary btn-md">View Notes</button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default StudentDashboard;
