$(document).ready(function () {
  const totalStudentsElement = document.getElementById("total-students");
  const studentCtx = document.getElementById("studentChart").getContext("2d");
  const gradeCtx = document.getElementById("gradeChart").getContext("2d");

  let studentChart = new Chart(studentCtx, {
    type: "bar",
    data: {
      labels: ["Total Students"],
      datasets: [
        {
          label: "Number of Students",
          data: [0],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });

  let gradeChart = new Chart(gradeCtx, {
    type: "bar",
    data: {
      labels: ["A+", "A", "B", "C", "D", "S", "F"],
      datasets: [
        {
          label: "Number of Students",
          data: [30, 45, 60, 20, 10, 0],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Students",
          },
        },
        x: {
          title: {
            display: true,
            text: "Grades",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Student Grade Distribution",
        },
      },
    },
  });

  function updateStudentChart(total) {
    studentChart.data.datasets[0].data = [total];
    studentChart.update();
  }

  function updateGradeChart(gradeData) {
    gradeChart.data.datasets[0].data = Object.values(gradeData);
    gradeChart.update();
  }

  async function fetchStudentData() {
    const MAX_RETRIES = 3;
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const response = await fetch(
          "https://autogradesystem.onrender.com/student/get-students",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const total = data.students.length;

        totalStudentsElement.textContent = `Total Students: ${total}`;
        updateStudentChart(total);
        localStorage.setItem("totalStudents", total);

        const gradeCounts = {
          "A+": 0,
          A: 0,
          B: 0,
          C: 0,
          D: 0,
          S: 0,
          F: 0,
        };

        data.students.forEach((student) => {
          const grade = student.grade;
          if (gradeCounts.hasOwnProperty(grade)) {
            gradeCounts[grade] += 1;
          }
        });
        updateGradeChart(gradeCounts);

        return;
      } catch (error) {
        console.error(`Fetch attempt ${retries + 1} failed:`, error);
        retries++;

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    console.error("Failed to fetch student data after multiple attempts");
    totalStudentsElement.textContent = "Unable to fetch student data";
  }

  const storedTotalStudents = localStorage.getItem("totalStudents");
  if (storedTotalStudents) {
    totalStudentsElement.textContent = `Total Students: ${storedTotalStudents}`;
    updateStudentChart(parseInt(storedTotalStudents));
  } else {
    totalStudentsElement.textContent = "Total Students: 0";
  }

  let form = document.querySelector("#grade-form");
  const resultDiv = document.getElementById("result");
  const studentData = [];
  const profileData = document.querySelector(".profile__data");
  const profile = document.querySelector(".profile");

  function displayStudentData() {
    let result = "";
    studentData.forEach((student, index) => {
      result += `Student ${index + 1}:\n`;
      result += `Assignment: ${student.assignmentName}\n`;
      result += `Student: ${student.studentName}\n`;
      result += `Score: ${student.score}\n`;
      result += `Grade: ${student.grade}\n\n`;
    });
    resultDiv.innerText = result;
  }

  const fetchUserDetails = () => {
    let data = localStorage.getItem("user-info");
    console.log(data);

    if (!data) return;

    try {
      data = JSON.parse(data);
      const nameEle = `<p>Name: ${data.name}</p>`;
      const emailEle = `<p>Email: ${data.email}</p>`;

      profileData.innerHTML = nameEle + emailEle;
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  };
  profile.addEventListener("click", () => {
    profileData.classList.toggle("toggle__view");

    setTimeout(() => {
      profileData.classList.remove("toggle__view");
    }, 4000);
  });
  fetchUserDetails();

  function logout() {
    console.log("Logging out...");
    window.location.href = "/login.html";
  }

  function updateGraphicDetails(total) {
    const graphicDetailsElement = document.getElementById("Graphic-Details");
    graphicDetailsElement.textContent = `Graphic Details: ${total}`;
  }

  fetchStudentData().then(() => {
    const totalStudents = localStorage.getItem("totalStudents");
    updateGraphicDetails(parseInt(totalStudents));
  });
});
