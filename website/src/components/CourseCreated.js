import React from "react";
import GradientContainer from "./GradientContainer";
import BrandHeader from "./BrandHeader";
import "./CourseCreated.css";

class CourseCreated extends React.Component {
  state = {
    btnText: "Copy"
  };

  getmailText = () =>
    `mailto:someone@gmail.com?subject=Course%20ID%20for%20course%20${encodeURI(
      this.props.courseName
    )}%20&body=Please%20find%20course%20ID%20for%20your%20upcoming%20course%20on%20DALP%20in%20this%20mail%20below.Course%20Facilitator%20${encodeURI(
      this.props.name
    )}%3ACourse%20Name%20${encodeURI(
      this.props.courseName
    )}%3ACourse%20ID%20${encodeURI(
      this.props.courseId
    )}%3AGo%20to%20DALP%20and%20enter%20this%20course%20ID%20while%20registering.`;

  onClickCopy = e => {
    this.text.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({ btnText: "Copied" });
  };
  render() {
    return (
      <div className="course-created">
        <GradientContainer>
          <BrandHeader />
          <div className="row">
            <div className="col"></div>
            <div className="col-md-8">
              <div className="card text-center">
                <div className="card-body">
                  <div className="card-title">Course successfully created</div>
                  <div className="card-text">
                    Hello <b>{this.props.name}</b>,<br />
                    Your course <b>{this.props.courseName}</b> has been created.
                    Do share the course ID with the students for them to join
                    the course. Your course ID is:
                    <div className="input-group mb-3 mt-3">
                      <input
                        readOnly
                        type="text"
                        className="form-control"
                        value={this.props.courseId}
                        ref={text => {
                          this.text = text;
                        }}
                      ></input>
                      <span className="input-group-append">
                        <button
                          className="btn btn-outline-primary"
                          onClick={this.onClickCopy}
                        >
                          {this.state.btnText}
                        </button>
                      </span>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <button className="btn btn-primary btn-md">
                          <a
                            href={this.getmailText()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Share course ID
                          </a>
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          className="btn btn-primary btn-md"
                          onClick={this.props.onDashboardNavigate}
                        >
                          Go to dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col"></div>
          </div>
        </GradientContainer>
      </div>
    );
  }
}

export default CourseCreated;
