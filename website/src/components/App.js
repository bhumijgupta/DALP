import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import TeacherLogin from "./TeacherLogin";
import TeacherSetup from "./TeacherSetup";
import StudentLogin from "./StudentLogin";
import NotFound from "./NotFound";
import "./App.css";

class App extends Component {
  state = {
    StudentAuth: false,
    TeacherAuth: false,
    TeacherState: null,
    StudentState: null
  };
  componentDidMount() {}

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
            <Route exact path="/teacher/setup" component={TeacherSetup}></Route>
            <Route component={NotFound}></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
