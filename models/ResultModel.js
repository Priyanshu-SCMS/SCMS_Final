const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  prn: { type: String, required: true },
  motherName: { type: String, required: true },
  name: String,
  stream: String,
  year: String,
  classSection: String,
  semester: String,
  sgpi: String,
  subjects: [
    {
      subjectName: String,
      marks: String,
      grade: String,
    },
  ],
});

const ResultModel = mongoose.model("Result", resultSchema);
module.exports = ResultModel;
