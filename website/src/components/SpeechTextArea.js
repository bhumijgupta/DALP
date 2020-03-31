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
      <div>
        <div id="wrapper">
          <textarea
            ref={this.textLog}
            id="text"
            name="text"
            value={this.props.phrase}
          ></textarea>
        </div>
      </div>
    );
  }
}
export default SpeechTextArea;
