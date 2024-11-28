const form = document.getElementById("grade-form");
const resultDiv = document.getElementById("result");
const yearSelect = document.getElementById("year");
const semesterSelect = document.getElementById("semester");
const assignmentSelect = document.getElementById("assignment-name");
const studentData = [];
const assignments = {
  1: {
    1: [
      "Introduction to Programming",
      "Basic Web Development",
      "Mathematics for Computer Science",
    ],
    2: [
      "Object-Oriented Programming",
      "Database Fundamentals",
      "Computer Networks",
    ],
  },
  2: {
    3: [
      "Data Structures and Algorithms",
      "Operating Systems",
      "Software Engineering",
    ],
    4: [
      "Web Application Development",
      "Artificial Intelligence",
      "Computer Graphics",
    ],
  },
  3: {
    5: ["Machine Learning", "Cloud Computing", "Mobile App Development"],
    6: ["Big Data Analytics", "Cybersecurity", "Internet of Things"],
  },
  4: {
    7: [
      "Advanced AI and Deep Learning",
      "Blockchain Technology",
      "Quantum Computing",
    ],
    8: ["Capstone Project", "Ethics in Computing", "Emerging Technologies"],
  },
};

yearSelect.addEventListener("change", updateSemesters);
semesterSelect.addEventListener("change", updateAssignments);

function updateSemesters() {
  const year = yearSelect.value;
  semesterSelect.innerHTML =
    '<option value="">--Please choose a semester--</option>';
  semesterSelect.disabled = !year;
  assignmentSelect.innerHTML =
    '<option value="">--Please choose an Assignment--</option>';
  assignmentSelect.disabled = true;

  if (year) {
    const semesters =
      year === "1"
        ? ["1st Sem", "2nd Sem"]
        : year === "2"
        ? ["3rd Sem", "4th Sem"]
        : year === "3"
        ? ["5th Sem", "6th Sem"]
        : ["7th Sem", "8th Sem"];

    semesters.forEach((sem, index) => {
      const option = document.createElement("option");
      option.value = (parseInt(year) - 1) * 2 + index + 1;
      option.textContent = sem;
      semesterSelect.appendChild(option);
    });
  }
}

function updateAssignments() {
  const year = yearSelect.value;
  const semester = semesterSelect.value;
  assignmentSelect.innerHTML =
    '<option value="">--Please choose an Assignment--</option>';
  assignmentSelect.disabled = !semester;

  if (year && semester) {
    assignments[year][semester].forEach((assignment) => {
      const option = document.createElement("option");
      option.value = assignment;
      option.textContent = assignment;
      assignmentSelect.appendChild(option);
    });
  }
}

const addStudent = async (student) => {
  try {
    const res = await fetch(
      "https://autogradesystem.onrender.com/student/create-student",
      {
        headers: {
          "Content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(student),
      }
    );

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Error adding student:", error);
  }
};

function calculateGrade(score) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  if (score >= 40) return "S";
  return "F";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentName = document.getElementById("student-name").value;
  const year = yearSelect.value;
  const semester = semesterSelect.options[semesterSelect.selectedIndex].text;
  const assignmentName = assignmentSelect.value;
  const score = parseInt(document.getElementById("score").value);

  if (score < 10 || score > 100) {
    alert("Score must be between 10 and 100.");
    return;
  }

  const grade = calculateGrade(score);

  const student = {
    studentName,
    year,
    semester,
    assignmentName,
    score,
    grade,
  };
  studentData.push(student);
  addStudent(student);

  displayStudentData();
  form.reset();
  semesterSelect.disabled = true;
  assignmentSelect.disabled = true;
});

function displayStudentData() {
  let result = "";
  studentData.forEach((student, index) => {
    result += `Student ${index + 1}:\n`;
    result += `Name: ${student.studentName}\n`;
    result += `Year: ${student.year}\n`;
    result += `Semester: ${student.semester}\n`;
    result += `Assignment: ${student.assignmentName}\n`;
    result += `Score: ${student.score}\n`;
    result += `Grade: ${student.grade}\n\n`;
  });
  resultDiv.innerText = result;
}

form.addEventListener("reset", () => {
  studentData.length = 0;
  resultDiv.innerText = "";
  semesterSelect.disabled = true;
  assignmentSelect.disabled = true;
});
