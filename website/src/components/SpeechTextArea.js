import React, { Component } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

import './SpeechTextArea.css'

class SpeechTextArea extends Component {

  constructor(props) {
    super(props);
    this.textLog = React.createRef();

  }

  render() {    
    
    return (
    
<div>
        <div id="wrapper">
            <textarea ref={this.textLog} id="text" name="text" value = {this.props.phrase}></textarea> 
        </div>   
</div>
    );
  }
}
export default SpeechTextArea;
