import React, { Component } from "react";
import GradientContainer from "./GradientContainer";
import BrandHeader from "./BrandHeader";
import WhiteBtnOutline from "./WhiteBtnOutline";

// props - currNum, onSubmitPush
export class QuizSetupForm extends Component {
  state = {
    title: "",
    option1: "",
    option2: "",
    answer: 0
  };

  //   reset state, if the component updates
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currQues !== this.props.currQues) {
      this.setState({ title: "", option1: "", option2: "", answer: 0 });
    }
  }

  onFormSubmit = e => {
    e.preventDefault();
    this.props.addQuestion({ ...this.state, num: this.props.currQues });
  };
  render() {
    return (
      <div className="quiz-setup">
        <GradientContainer>
          <BrandHeader />
          <div className="row">
            <div className="col"></div>
            <div className="col-md-6 com-sm-12">
              <div className="title text-center">
                Question {this.props.currQues}
              </div>
              <br />
              <form onSubmit={this.onFormSubmit}>
                <div className="form-group">
                  <textarea
                    type="text"
                    className="form-control"
                    value={this.state.title}
                    placeholder="Question"
                    onChange={e =>
                      this.setState({
                        title: e.target.value
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.option1}
                    onChange={e => {
                      this.setState({ option1: e.target.value });
                    }}
                    placeholder="Option 1"
                    required
                  ></input>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.option2}
                    onChange={e => {
                      this.setState({ option2: e.target.value });
                    }}
                    placeholder="Option 2"
                    required
                  ></input>
                </div>
                <div className="form-group">
                  <select
                    onChange={e => {
                      this.setState({ answer: parseInt(e.target.value) });
                    }}
                    value={`${this.state.answer}`}
                    className="form-control"
                  >
                    <option value="0" disabled>
                      Select correct answer
                    </option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                  </select>
                </div>
                <WhiteBtnOutline>
                  {this.props.currQues === this.props.numQues
                    ? "Finish"
                    : "Continue"}
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

export default QuizSetupForm;
