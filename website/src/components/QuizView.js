import React, { Component } from "react";
import GradientContainer from "./GradientContainer";

export class QuizView extends Component {
  render() {
    return (
      <div className="quiz-view">
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
              </form>
            </div>
            <div className="col"></div>
          </div>
        </GradientContainer>
      </div>
    );
  }
}

export default QuizView;
