import React, { Component } from "react";
import GradientContainer from "./GradientContainer";
import "./QuizView.css";
import WhiteBtnOutline from "./WhiteBtnOutline";

export class QuizView extends Component {
  state = {
    currQues: 1,
    answers: [],
    showMarks: false,
    marks: -1
  };

  componentDidUpdate = (prevProps, prevState) => {
    // If last question then calculate marks and show
    if (this.state.showMarks === true && this.state.marks === -1) {
      let marks = 0;
      this.state.answers.forEach((answer, index) => {
        if (answer === this.props.questions[index].answer) marks += 1;
      });
      this.setState({ marks });
    }
  };

  selectOption1 = () => {
    let state = {
      answers: [...this.state.answers, 1],
      currQues: this.state.currQues + 1
    };
    if (this.state.currQues === this.props.questions.length) {
      state = { ...state, showMarks: true };
    }
    this.setState(state);
  };

  selectOption2 = () => {
    let state = {
      answers: [...this.state.answers, 2],
      currQues: this.state.currQues + 1
    };
    if (this.state.currQues === this.props.questions.length) {
      state = { ...state, showMarks: true };
    }
    this.setState(state);
  };

  showMarks = () => {
    return (
      <>
        <div className="title text-center mb-3">
          You scored {this.state.marks} / {this.props.questions.length}
        </div>
        <br />
        <WhiteBtnOutline
          onClick={() => {
            this.props.submitMarks(this.state.marks);
          }}
        >
          Continue
        </WhiteBtnOutline>
      </>
    );
  };

  showQuestions = () => {
    return (
      <>
        <div className="title text-center mb-3">
          Question {this.state.currQues}
        </div>
        <div className="w100 text-center">
          {this.props.questions[this.state.currQues - 1].title}
        </div>
        <div className="row">
          <div className="col-md-6">
            <WhiteBtnOutline onClick={this.selectOption1}>
              {this.props.questions[this.state.currQues - 1].option1}
            </WhiteBtnOutline>
          </div>
          <div className="col-md-6">
            <WhiteBtnOutline onClick={this.selectOption2}>
              {this.props.questions[this.state.currQues - 1].option2}
            </WhiteBtnOutline>
          </div>
        </div>
      </>
    );
  };

  render() {
    return (
      <div className="quiz-view">
        <GradientContainer>
          <div className="row">
            <div className="col"></div>
            <div className="col-md-6 com-sm-12">
              <div className="text-center header mb-3">{this.props.title}</div>
              <br />
              {this.state.showMarks ? this.showMarks() : this.showQuestions()}
            </div>
            <div className="col"></div>
          </div>
        </GradientContainer>
      </div>
    );
  }
}

export default QuizView;
