import React, { Component } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

import NavBar from "./NavBar";
import "./TeacherDashboard.css";
import Video from "./Video";
export class TeacherDashboard extends Component {
  state = {
    img: "",
    stream: null,
    streaming: false,
    joineeList: [],
    intervalKey: null,
    socket: null,
    socketSet: false,
    quizSent: false,
    quizResults: [],
    phraseDiv: "",
    statusDiv: "",
    reco: ""
  };

  componentDidMount = () => {
    if (this.props.TeacherAuth) {
      this.canvas = React.createRef();
      //Initialising the peer
      const peer = new Peer(this.props.TeacherState.courseId, {
        host: "127.0.0.1",
        port: 8080,
        path: "/myapp"
      });
      //Initialising the socket and setting the state to be used anywhere
      const socket = io(`http://localhost:8081`);
      this.setState({ socket, socketSet: true });
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          console.log("Teacher Streaming successfully.");
          //Setting teacher's video
          //IMPORTANT: DO NOT SET ANY STATE BEFORE THIS
          this.setState({ socketSet: false });
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
        //Sending the stream back only is streaming
        if (this.state.streaming) call.answer(this.state.stream);
      });
    }
  };
  //Join the room once the socket is set
  componentDidUpdate = () => {
    if (this.state.socketSet) {
      this.state.socket.emit("join-room", {
        room: this.props.TeacherState.courseId,
        username: this.props.TeacherState.name
      });
      console.log("Teacher joined the room");
      // TODO: check for student leaving
      this.state.socket.on("student-join", data => {
        this.setState({ joineeList: [...this.state.joineeList, data] });
      });
    }
  };

  //Start Recording
  startSpeechRecognition = () => {
    var lastRecognized = "";
    var phraseDivx = "";
    var statusDivx = "";

    var audioConfig;

    // audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    var pushStream = SpeechSDK.AudioInputStream.createPushStream();
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        pushStream.write(stream);
        // console.log(stream);
        console.log("STATE");
        // console.log(this.state.stream);

        // audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
      });

    // pushStream.write(this.state.stream);
    // audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);

    var speechConfig;
    speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      "9711663ef014426fbf2140be66f96488",
      "centralindia"
    );

    speechConfig.speechRecognitionLanguage = "en-US";

    var reco;
    reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    //Set reco to state here???

    reco.recognizing = (s, e) => {
      console.log("RECO.RECOGNIZING");

      console.log(e.result.text);

      phraseDivx = lastRecognized + e.result.text;
      this.setState({
        phraseDiv: phraseDivx,
        statusDiv: statusDivx
      });
    };
    reco.recognized = (s, e) => {
      console.log("RECO.RECOGNIZED");

      console.log(e.result.text);

      // Indicates that recognizable speech was not detected, and that recognition is done.
      if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
        var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(e.result);

        statusDivx +=
          SpeechSDK.ResultReason[e.result.reason] +
          SpeechSDK.NoMatchReason[noMatchDetail.reason];

        //window.console.log(statusDivx);
      } else {
        statusDivx +=
          "(recognized)  Reason: " +
          SpeechSDK.ResultReason[e.result.reason] +
          " Text: " +
          e.result.text +
          "\r\n";
        //window.console.log(statusDivx);
      }

      lastRecognized += e.result.text + "\r\n";
      phraseDivx = lastRecognized;
      window.console.log("PHRASEDIVX");
      window.console.log(phraseDivx);

      this.setState(prevState => ({
        phraseDiv: phraseDivx,
        //   statusDiv: statusDivx,
        reco: reco
      }));
    };

    // Starts recognition
    reco.startContinuousRecognitionAsync();
  };

  // Stop Speech Recognition
  stopSpeechRecognition = () => {
    // window.console.log(this.state.reco)

    this.state.reco.stopContinuousRecognitionAsync(
      function() {
        this.state.reco.close();
        this.setState({ reco: undefined });
      },
      function(err) {
        this.state.reco.close();
        this.setState({ reco: undefined });
      }
    );
  };

  // Start streaming
  onStreamBtnClick = () => {
    if (this.state.streaming === true) {
      clearInterval(this.state.intervalKey);
      this.setState({ streaming: false, intervalKey: null });

      // this.stopSpeechRecognition();
    } else {
      this.setState({ streaming: true });
      // Ask recievers to class teacher
      this.state.socket.emit("s-call");
      // Start sending screenshots
      let key = setInterval(this.sendScreenshot, 3000);
      this.setState({ intervalKey: key });

      // TODO: Allandhir implement transcript sending
      // this.startSpeechRecognition();
    }
  };

  getAllNames = () => {
    return this.state.joineeList.map((name, index) => {
      return <div key={index}>{name}</div>;
    });
  };

  getAudioStream = () => {
    return this.state.stream.getAudioTracks()[0];
  };

  getVideoRef = ref => {
    this.video = ref;
  };

  sendScreenshot = async () => {
    let imgurl = await this.getScreenshot();
    // console.log(imgurl);
    this.state.socket.emit("s-image", imgurl);
  };

  // TODO: Chandak screenshot
  getScreenshot = () => {
    return new Promise((resolve, reject) => {
      this.ctx = this.canvas.current.getContext("2d");
      this.ctx.imageSmoothingEnabled = true;
      // Brighten up the image
      this.ctx.filter = "brightness(150%)";
      // Draw frame on canvas
      this.ctx.drawImage(
        this.video.current,
        0,
        0,
        this.canvas.current.width,
        this.canvas.current.height
      );
      this.canvas.current.toBlob(
        data => {
          // console.log(data);
          resolve(data);
        },
        "image/png",
        0.5
      );
    });
  };

  onQuizSend = () => {
    console.log("Sending quiz");
    this.state.socket.emit("s-quiz", {
      quiz: this.props.TeacherState.quiz,
      title: this.props.TeacherState.quizTitle
    });
    this.state.socket.on("s-quiz-submit", data => {
      this.setState({ quizResults: [...this.state.quizResults, data] });
    });
    this.setState({ quizSent: true });
  };

  quizContainer = () => {
    return (
      <>
        <h5 className="card-title">{this.props.TeacherState.quizTitle}</h5>
        <div className="card-text">
          No. of questions:{" "}
          {this.props.TeacherState.quiz === null
            ? 0
            : this.props.TeacherState.quiz.length}
        </div>
        <button className="btn btn-outline-primary" onClick={this.onQuizSend}>
          Launch Quiz
        </button>
      </>
    );
  };

  quizLeaderboard = () => {
    return (
      <>
        <h5 className="card-title">
          {this.props.TeacherState.quizTitle} - Result
        </h5>
        <div className="card-text">
          {this.state.quizResults.map(({ name, marks }, index) => {
            return (
              <div key={index}>
                {name} - {marks}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  render() {
    if (!this.props.TeacherAuth) {
      return <Redirect to="/teacher"></Redirect>;
    }
    return (
      <div className="teacher-dashboard mb-3">
        <NavBar name={this.props.TeacherState.name} />
        <div className="container content">
          <div className="row">
            <div className="col-md">
              <div className="course-title mb-2">
                <h3 className="course-name">
                  {this.props.TeacherState.courseName}
                </h3>
                <span className="text-muted">
                  Course ID: {this.props.TeacherState.courseId}
                </span>
              </div>
              <Video
                src={this.state.stream}
                returnRef={this.getVideoRef}
                size="embed-responsive-16by9"
              />
              <div className="text-center mt-3">
                <button
                  className="btn btn-primary btn-md"
                  onClick={this.onStreamBtnClick}
                >
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                    style={{
                      display: this.state.streaming ? "inline-block" : "none"
                    }}
                  ></span>
                  {this.state.streaming ? "Stop" : "Start"} streaming
                </button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="classroom-title mb-2">
                <h3>Classroom</h3>
                <span className="text-muted">
                  Strength: {this.state.joineeList.length}
                </span>
              </div>
              <div className="student-name">{this.getAllNames()}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md">
              <div className="course-title mb-2">
                <h3 className="course-name">Quizzes</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md">
              <div className="card">
                <div className="card-body">
                  {this.state.quizSent
                    ? this.quizLeaderboard()
                    : this.quizContainer()}
                </div>
              </div>
            </div>

            <canvas ref={this.canvas} width={640} height={480}></canvas>
          </div>
        </div>
      </div>
    );
  }
}

export default TeacherDashboard;
