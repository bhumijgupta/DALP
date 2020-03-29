import React, { Component } from "react";
import GradientContainer from "./GradientContainer";
import BrandHeader from "./BrandHeader";
import WhiteBtnOutline from "./WhiteBtnOutline";
import QuizSetupForm from "./QuizSetupForm";
import "./QuizSetup.css";
import { Redirect } from "react-router-dom";

export class QuizSetup extends Component {
  state = {
    numQues: 1,
    title: "",
    questions: [],
    showQuestionForm: false,
    skip: false,
    currQues: 1
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currQues !== this.state.currQues) {
      this.props.handleCreateQuiz({
        title: this.state.title,
        quiz: this.state.questions
      });
    }
  }

  skipForm = e => {
    e.preventDefault();
    this.setState({
      skip: true
    });
  };

  addQuestion = question => {
    let newQuestion = [...this.state.questions, question];
    this.setState({
      questions: newQuestion,
      currQues: this.state.currQues + 1
    });
  };

  render() {
    if (this.state.skip || this.state.currQues > this.state.numQues) {
      return <Redirect to="/teacher/dashboard" />;
    }
    // Show Quiz setup form
    else if (this.state.showQuestionForm) {
      return (
        <QuizSetupForm
          addQuestion={this.addQuestion}
          currQues={this.state.currQues}
          numQues={this.state.numQues}
        />
      );
    }
    return (
      <div className="quiz-setup">
        <GradientContainer>
          <BrandHeader />
          <div className="row">
            <div className="col"></div>
            <div className="col-md-6 com-sm-12">
              <div className="title text-center">Quiz Setup</div>
              <br />
              <form
                onSubmit={e => {
                  e.preventDefault();
                  this.setState({ showQuestionForm: true });
                }}
              >
                <div className="form-group">
                  <label htmlFor="quiz-name">Quiz title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="quiz-name"
                    value={this.state.title}
                    onChange={e =>
                      this.setState({
                        title: e.target.value
                      })
                    }
                    required
                  ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="numQuestion">Number of questions</label>
                  <input
                    type="number"
                    className="form-control"
                    id="numQuestions"
                    value={this.state.numQues}
                    onChange={e => {
                      this.setState({ numQues: parseInt(e.target.value) });
                    }}
                    min="1"
                    max="5"
                    required
                  ></input>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <WhiteBtnOutline type="reset" onClick={this.skipForm}>
                      Skip
                    </WhiteBtnOutline>
                  </div>
                  <div className="col-md-6">
                    <WhiteBtnOutline
                      type="submit"
                      disabled={this.state.title.length === 0}
                    >
                      Continue
                    </WhiteBtnOutline>
                  </div>
                </div>
              </form>
            </div>
            <div className="col"></div>
          </div>
        </GradientContainer>
      </div>
    );
  }
}

export default QuizSetup;
