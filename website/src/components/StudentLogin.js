import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import api from "../api";
import GradientContainer from "./GradientContainer";
import WhiteBtnOutline from "./WhiteBtnOutline";
import BrandHeader from "./BrandHeader";
import "./StudentLogin.css";

export class Student extends Component {
  state = {
    name: "",
    courseId: "",
    verifyId: null,
    redirect: false
  };

  componentDidUpdate = async () => {
    //TODO:I think verify is enough
    if (this.state.courseId.length === 18 && this.state.verifyId === null) {
      let response = await api.get(`/verify/${this.state.courseId}`);
      console.log("response", response);
      this.setState({ verifyId: response.data.exist });
    }
  };

  onCourseIdChange = e => {
    this.setState({ courseId: e.target.value, verifyId: null });
  };

  handleButtonClick = e => {
    e.preventDefault();
    this.props.onSuccess({
      name: this.state.name,
      courseId: this.state.courseId
    });
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/student/setup" />;
    }
    return (
      <div className="student">
        <GradientContainer>
          <BrandHeader />
          <div className="row">
            <div className="col"></div>
            <div className="col-md-6 com-sm-12">
              <div className="title text-center">Student Login</div>
              <br />
              <form>
                <div className="form-group">
                  <label htmlFor="student-form-name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="student-form-name"
                    value={this.state.name}
                    onChange={e =>
                      this.setState({
                        name: e.target.value
                      })
                    }
                    required
                  ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="student-form-id">Course ID</label>
                  <input
                    type="text"
                    className={
                      this.state.verifyId !== true
                        ? "form-control is-invalid"
                        : "form-control is-valid"
                    }
                    id="student-form-id"
                    value={this.state.courseId}
                    onChange={this.onCourseIdChange}
                    required
                  ></input>
                  <div className="invalid-feedback">Invalid course ID</div>
                </div>
                <WhiteBtnOutline
                  disabled={!(this.state.verifyId === true)}
                  onClick={this.handleButtonClick}
                >
                  Login
                </WhiteBtnOutline>
              </form>
            </div>
            <div className="col"></div>
          </div>
        </GradientContainer>
      </div>
    );
  }
}

export default Student;
