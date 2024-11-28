const studentTable = document.getElementById("students-table");
const searchInput = document.getElementById("searchInput");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const closeBtn = document.getElementsByClassName("close")[0];
let studentsData = [];

const fetchStudentData = async () => {
  try {
    const response = await fetch(
      "https://autogradesystem.onrender.com/student/get-students"
    );
    const data = await response.json();
    console.log(data);

    studentsData = data.students;
    renderStudents(studentsData);
    updateTotalStudents(studentsData.length);
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
};

const updateTotalStudents = (count) => {
  localStorage.setItem("totalStudents", count);
};

const renderStudents = (students) => {
  const tbody = studentTable.querySelector("tbody");
  tbody.innerHTML = "";

  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${index + 1}</td>
    <td>${student.studentName || ""}</td>
    <td>${student.year || ""}</td>
    <td>${student.semester || ""}</td>
    <td>${student.assignmentName || ""}</td>
    <td>${student.score !== undefined ? student.score : ""}</td>
    <td>${student.grade || ""}</td>
    <td>
      <button class="action-btn edit-btn" data-id="${student._id}">Edit</button>
      <button class="action-btn delete-btn" data-id="${
        student._id
      }">Delete</button>
    </td>
  `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => openEditModal(btn.dataset.id));
  });
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteStudent(btn.dataset.id));
  });
};

const filterStudents = (searchTerm) => {
  const filteredStudents = studentsData.filter(
    (student) =>
      (student.studentName &&
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.year &&
        student.year.toString().includes(searchTerm.toLowerCase())) ||
      (student.semester &&
        student.semester.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.assignmentName &&
        student.assignmentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (student.grade &&
        student.grade.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.score !== undefined &&
        student.score.toString().includes(searchTerm.toLowerCase()))
  );
  renderStudents(filteredStudents);
};

const openEditModal = (studentId) => {
  const student = studentsData.find((s) => s._id === studentId);
  if (student) {
    document.getElementById("editStudentId").value = student._id;
    document.getElementById("editName").value = student.studentName || "";
    document.getElementById("editYear").value = student.year || "";
    document.getElementById("editSemester").value = student.semester || "";
    document.getElementById("editAssignment").value =
      student.assignmentName || "";
    document.getElementById("editScore").value =
      student.score !== undefined ? student.score : "";
    editModal.style.display = "block";
  }
};

const closeEditModal = () => {
  editModal.style.display = "none";
};

const updateStudent = async (e) => {
  e.preventDefault();
  const studentId = document.getElementById("editStudentId").value;
  const updatedStudent = {
    studentName: document.getElementById("editName").value,
    year: parseInt(document.getElementById("editYear").value, 10),
    semester: document.getElementById("editSemester").value,
    assignmentName: document.getElementById("editAssignment").value,
    score: parseInt(document.getElementById("editScore").value, 10),
  };

  try {
    const response = await fetch(
      `https://autogradesystem.onrender.com/student/update-student/${studentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      }
    );

    if (response.ok) {
      closeEditModal();
      fetchStudentData();
    } else {
      console.error("Failed to update student");
    }
  } catch (error) {
    console.error("Error updating student:", error);
  }
};

const deleteStudent = async (studentId) => {
  if (confirm("Are you sure you want to delete this student?")) {
    try {
      const response = await fetch(
        `https://autogradesystem.onrender.com/student/delete-student/${studentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchStudentData();
      } else {
        console.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  }
};

searchInput.addEventListener("input", (e) => {
  filterStudents(e.target.value);
});

closeBtn.onclick = closeEditModal;
window.onclick = (event) => {
  if (event.target == editModal) {
    closeEditModal();
  }
};

editForm.addEventListener("submit", updateStudent);

fetchStudentData();
