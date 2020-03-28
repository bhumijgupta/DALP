import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Student
import StudentLogin from "./StudentLogin";
import StudentSetup from "./StudentSetup";
import StudentDashboard from "./StudentDashboard";
// Teacher
import TeacherLogin from "./TeacherLogin";
import TeacherSetup from "./TeacherSetup";
import TeacherDashboard from "./TeacherDashboard";
// Other
import Home from "./Home";
import NotFound from "./NotFound";
import "./App.css";

class App extends Component {
  state = {
    StudentAuth: false,
    TeacherAuth: false,
    TeacherState: null,
    StudentState: null
    // TeacherState: {
    //   name: "Rajvir Thakur",
    //   courseId: "abcd-efgh-ijkl-mnopqrs",
    //   courseName: "Introduction to DBMS"
    // },
    // StudentState: {
    //   name: "Bhumij Gupta",
    //   courseId: "abcd-efgh-ijkl-mnopqrs"
    // }
  };

  handleStudentLogin = StudentState => {
    this.setState({
      StudentAuth: true,
      StudentState
    });
  };

  handleTeacherLogin = TeacherState => {
    this.setState({
      TeacherAuth: true,
      TeacherState
    });
  };
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route
              exact
              path="/teacher"
              render={() => (
                <TeacherLogin onSuccess={this.handleTeacherLogin} />
              )}
            ></Route>
            <Route
              exact
              path="/student"
              render={() => (
                <StudentLogin onSuccess={this.handleStudentLogin} />
              )}
            ></Route>
            <Route
              exact
              path="/student/setup"
              render={() => <StudentSetup {...this.state} />}
            ></Route>
            <Route
              exact
              path="/student/dashboard"
              render={() => <StudentDashboard {...this.state} />}
            ></Route>
            <Route
              exact
              path="/teacher/setup"
              render={() => <TeacherSetup {...this.state} />}
            ></Route>
            <Route
              exact
              path="/teacher/dashboard"
              render={() => <TeacherDashboard {...this.state} />}
            ></Route>
            <Route component={NotFound}></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
