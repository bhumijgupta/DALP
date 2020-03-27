const express = require("express");
const sanitizer = require("sanitizer");
const router = express.Router();
const Course = require("../models/Course");
//Room producing function
const getRoom = (name, coursename, uniqueId) => {
  const tillFlag = coursename.length > 4 ? 4 : coursename.length;

  return (
    name.substr(0, tillFlag) +
    coursename.substr(0, tillFlag) +
    String(Date.now()).substr(
      String(Date.now()).length - 4,
      String(Date.now()).length
    ) +
    uniqueId.substr(0, 6)
  );
};
const verifyID = (courses, courseID) => {
  let flag = 0;
  return new Promise((resolve, reject) => {
    courses.map((obj, index) => {
      if (obj.room === courseID) {
        resolve(true);
        flag = 1;
      }
    });
    if (flag == 0) resolve(false);
  });
};
router.post("/new", (req, res) => {
  const course = {
    name: sanitizer.sanitize(req.body.name),
    coursename: sanitizer.sanitize(req.body.coursename)
  };
  Course.create(course)
    .then(response => {
      const room = getRoom(
        response.name,
        response.coursename,
        String(response._id)
      );
      Course.findByIdAndUpdate(response._id, { $set: { room } }, { new: true })
        .then(res2 => {
          res.json({ statusCode: 200, courseID: res2.room });
        })
        .catch(err => {
          res.status(500).json({ mssg: "Internal Error" });
        });
    })
    .catch(err => {
      res.status(500).json({ mssg: "Internal Error" });
    });
});
router.get("/verify/:courseID", async (req, res) => {
  const courseID = req.params.courseID;
  const response = await Course.find({});
  const ans = await verifyID(response, courseID);
  res.json({ statusCode: 200, exist: ans });
});

module.exports = router;
