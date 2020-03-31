import React, { Component } from "react";

import "./SpeechTextArea.css";

class SpeechTextArea extends Component {
  constructor(props) {
    super(props);
    this.textLog = React.createRef();
  }

  componentDidUpdate() {
    this.textLog.current.scrollTop = this.textLog.current.scrollHeight;
  }

  render() {
    return (
      <div className="col-md-4">
        <div className="transcript-container title mb-2">
          <h3 className="mb-2">Transcript</h3>
        </div>
        <textarea
          ref={this.textLog}
          id="text"
          name="text"
          value={this.props.phrase}
          readOnly
          className="mt-3"
        ></textarea>
      </div>
    );
  }
}
export default SpeechTextArea;
