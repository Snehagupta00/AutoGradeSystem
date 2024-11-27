const express = require("express");
const Student = require("../models/student");

const router = express.Router();

router.post("/create-student", async (req, res) => {
  try {
    const { assignmentName, studentName, score, year, semester } = req.body;

    if (!assignmentName || !studentName || !year || !semester) {
      return res.status(400).json({ msg: "Please enter all required details" });
    }

    let grade = "";
    if (score !== undefined) {
      if (score >= 90) grade = "A+";
      else if (score >= 80) grade = "A";
      else if (score >= 70) grade = "B";
      else if (score >= 60) grade = "C";
      else if (score >= 50) grade = "D";
      else if (score >= 40) grade = "S";
      else grade = "F";
    }

    const newStudent = await Student.create({
      assignmentName,
      studentName,
      score,
      grade,
      year,
      semester,
    });

    res.status(201).json({
      student: newStudent,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/get-students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({
      students,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/update-student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { assignmentName, studentName, score, year, semester } = req.body;
    let grade = "";
    if (score !== undefined) {
      if (score >= 90) grade = "A+";
      else if (score >= 80) grade = "A";
      else if (score >= 70) grade = "B";
      else if (score >= 60) grade = "C";
      else if (score >= 50) grade = "D";
      else if (score >= 40) grade = "S";
      else grade = "F";
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { assignmentName, studentName, score, grade, year, semester },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.status(200).json({
      student: updatedStudent,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/delete-student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.status(200).json({
      msg: "Student deleted successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
