import * as faceapi from "face-api.js";

export const loadModel = async () => {
  const MODEL_URL = process.env.PUBLIC_URL + "/models";
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  // await faceapi.loadFaceDetectionModel(MODEL_URL);
  console.log(":loaded");
};

export const detectFaces = async stream => {
  // let faces = detectAllFaces(
  //   stream,
  //   new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 })
  // );
  let faces = faceapi.detectSingleFace(
    stream,
    new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.1 })
  );
  return faces;
};
