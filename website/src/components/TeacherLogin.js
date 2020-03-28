import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import api from "../api";
import GradientContainer from "./GradientContainer";
import WhiteBtnOutline from "./WhiteBtnOutline";
import BrandHeader from "./BrandHeader";
import CourseCreated from "./CourseCreated";
import "./TeacherLogin.css";

export class Teacher extends Component {
  state = {
    name: "",
    courseName: "",
    courseId: null,
    redirect: false
  };

  onFormSubmit = async e => {
    e.preventDefault();
    let resp = await api.post("/new", {
      name: this.state.name,
      coursename: this.state.courseName
    });
    this.setState({ courseId: resp.data.courseID });
    this.props.onSuccess(this.state);
  };

  onDashboardNavigate = e => {
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/teacher/setup"></Redirect>;
    } else if (this.state.courseId !== null) {
      return (
        <CourseCreated
          name={this.state.name}
          courseName={this.state.courseName}
          courseId={this.state.courseId}
          onDashboardNavigate={this.onDashboardNavigate}
        ></CourseCreated>
      );
    }
    return (
      <div className="teacher">
        <GradientContainer>
          <BrandHeader />
          <div className="row">
            <div className="col"></div>
            <div className="col-md-6 com-sm-12">
              <div className="title text-center">Teacher Login</div>
              <br />
              <form onSubmit={this.onFormSubmit} autoComplete="off">
                <div className="form-group">
                  <label htmlFor="teacher-form-name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="teacher-form-name"
                    value={this.state.name}
                    onChange={e =>
                      this.setState({
                        name: e.target.value
                      })
                    }
                    required
                  ></input>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="teacher-form-coursename">Course name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="teacher-form-coursename"
                    value={this.state.courseName}
                    onChange={e => {
                      this.setState({
                        courseName: e.target.value,
                        verifyId: false
                      });
                    }}
                    required
                  ></input>
                </div>
                <WhiteBtnOutline>Submit</WhiteBtnOutline>
              </form>
            </div>
            <div className="col"></div>
          </div>
        </GradientContainer>
      </div>
    );
  }
}

export default Teacher;
