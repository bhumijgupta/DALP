import React, { Component } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

import NavBar from "./NavBar";
import "./TeacherDashboard.css";
import Video from "./Video";
// import Axios from "axios";
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
    pdfLink: null,
    reco: null,
    pdfCall: false
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
      "9cff78d9e7c54afdaa0016d8e3849135",
      "centralindia"
    );

    speechConfig.speechRecognitionLanguage = "en-US";

    var reco;
    reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    console.log(reco);

    // console.log("RECOOOOOOO");
    // console.log(this.state.reco);
    // console.log(this.state.s);

    //Set reco to state here???

    reco.recognizing = (s, e) => {
      // console.log("RECO.RECOGNIZING");

      // console.log(e.result.text);

      phraseDivx = lastRecognized + e.result.text;

      if (e.result.text) this.state.socket.emit("s-partial", e.result.text);

      this.setState({
        phraseDiv: phraseDivx
      });
    };
    reco.recognized = (s, e) => {
      console.log("RECO.RECOGNIZED");
      console.log(e.result.text);

      if (e.result.text) this.state.socket.emit("s-trans", e.result.text);

      lastRecognized += e.result.text + "\r\n";
      phraseDivx = lastRecognized;
      window.console.log("PHRASEDIVX");
      window.console.log(phraseDivx);

      this.setState({
        phraseDiv: phraseDivx
        //   statusDiv: statusDivx,
      });
    };

    // Starts recognition
    this.setState(
      {
        reco: reco
      },
      () => {
        this.state.reco.startContinuousRecognitionAsync();
        this.setState({ streamingButtonDisabled: false });
      }
    );
  };

  // Stop Speech Recognition
  stopSpeechRecognition = () => {
    console.log("STOP");
    console.log(this.state.reco);

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
      this.setState({ streaming: false, intervalKey: null, pdfCall: true });

      this.stopSpeechRecognition();
      this.getPdfLink();
    } else {
      this.setState({ streaming: true });
      // Ask recievers to class teacher
      this.state.socket.emit("s-call");
      // Start sending screenshots
      let key = setInterval(this.sendScreenshot, 3000);

      this.setState({ intervalKey: key, streamingButtonDisabled: true }, () => {
        this.startSpeechRecognition();
      });

      // TODO: Allandhir implement transcript sending
    }
  };

  //Send POST request to Azure function to get PDF link
  getPdfLink = () => {
    const postBody = JSON.stringify({
      transcripts: this.state.phraseDiv,
      classID: this.props.TeacherState.courseName,
      screenshots: [
        "iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAh1BMVEUxMjH8/v8tLixQUVEYGhjU0tT29/ghHx/P0dIhIiEnKScVFhXm6OqCf4CnqKnW1dUbHBvb3N/JyMlYVVUAAAANDwyGh4lEPz8kJSO5u734+vuwsLGdnJ3v8PFBQUEqKSlJSklfX1+enp+Uk5Vzc3N5d3cBBgC9v8CDhIRpaGloZGVFRkY6OjlfBncRAAADPklEQVR4nO3Z6XKiQBSGYWQIkUUFAw4ad03U0fu/vlGkEfXQahFTUvU+vxJz6PQnbS9oGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACeyBQ9UCrX5tckjmVZQaKrKmn3duN3cf6IpJbNqVyraT3x/iz6zWazO5x5TmmV3GxqVjmgN2+IYqHW6si1H2VvtOsMR3nVaB64YpX5V2421U2qBlyUtCwmbD6W0FvaZ3X2LHg0YVfqxyOsXlnTP5Awbl9V9qSImoRv3tMC/kDCYCiUboSBWp4wFO/5A4J1acDqCc0PqXTwSELfqziTJq3ygNUTemEh1+nHz+sZtSyhH1QMaG47b0rWBT9/QRwfKuGpLNWZCj0xt6qjq5mbuMs8r3Vduwvztvxjkb3/sTupvBaagZWJsoa/vtUrQj9OCdenspTUk0RN0pv48Gc36me/L4VxmrcUZWvXW7TfJFTNV+RlCVvygpV3JEvY05elEtXX7+yFKFsZh7oFzsmm3474DlfwhISqryMvK3YXq/7eaqG7uE4J1T1s+MvguJdxg5T22ldJ2IoKH8KSQVdYLOz+l2c5d00br5LQDwvmJRFjv1EQtj/iO0K+SsIz/ZIjgzm7KBy1x+KsW1SrhIZzvWNaGTdOCvVKaAQb+6p6qV/lapZwfzy8Pl18ae9i3RLue5z0Lk/NY91n8VUSht0C7Qp+eIxhtPrFaXWlG6evknAdBydll8RH5mGwepNefvsHE81/eJWE9+xp4sbgoDE7DkrX26rThXQSUWqVMNtof6q+ukaWUDrmK3VKGKhhuVXFUbZ2/KvBPWxF8Rmpy656BGSPj0d1a6Mi1yChPTozEJ9iTPLZsz1NLMdQJ2Jbu7q8SMJLYkKn+KjNP+1u9OtnnRIaVigW7+qw4t+X0Nxdb0v3s5TuFtYsoeGO/avSof4hds0SGqb3eV442tzo+dMSWuHA3ruVMOimZZfKv3sygvHn6cunsGfdWkiTduPQ4qD5o48SD5z31K0j+ORdpLnMdOLpejhvz4ebnXfHRiH7D1W/UvtdppskTpLcEQ8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAL/oP5BU3wQ/BxT8AAAAASUVORK5CYII="
      ]
    });
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://dalp-generate-pdf.azurewebsites.net/api/GeneratePDF";
    fetch(proxyurl + url, {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      body: postBody,
      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        const resp = json.resp;
        if (resp.type !== "error") {
          console.log(resp.data);
          this.setState({ pdfCall: false, pdfLink: resp.data });
          this.state.socket.emit("s-link", resp.data);
        }
      });
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

  showCorrectBtn = () => {
    // If no pdfcall is under process and no pdfLink is present
    if (this.state.pdfCall === false && this.state.pdfLink === null)
      return (
        <button
          className="btn btn-primary btn-md"
          onClick={this.onStreamBtnClick}
          disabled={this.state.streamingButtonDisabled}
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
      );
    else {
      return (
        <button
          className="btn btn-primary btn-md"
          disabled={this.state.pdfCall}
        >
          <span
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
            style={{
              display: this.state.pdfCall ? "inline-block" : "none"
            }}
          ></span>
          {this.state.pdfCall ? (
            "Processing Notes"
          ) : (
            <a href={this.state.pdfLink} target="_blank">
              View Notes
            </a>
          )}
        </button>
      );
    }
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
              <div className="text-center mt-3">{this.showCorrectBtn()}</div>
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
