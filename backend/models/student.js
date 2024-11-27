const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  assignmentName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  grade: {
    type: String,
    enum: ["A+", "A", "B", "C", "S", "D", "F"],
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  semester: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Student", StudentSchema);
