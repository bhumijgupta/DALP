import React from "react";

export default function Transcript(props) {
  if (props.showTranscript)
    return (
      <div className="col-md-3">
        <div className="transcript-container title mb-2">
          <h3 className="mb-2">Transcript</h3>
        </div>
        <div className="transcript">Hello darkness</div>
      </div>
    );
  else return null;
}
