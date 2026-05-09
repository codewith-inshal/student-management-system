let students = JSON.parse(localStorage.getItem("students")) || [
  {
    name: "Ali",
    age: 20,
    city: "Lahore",
    attendance: true,
    marks: [98, 96, 94],
  },

  {
    name: "Ahmed",
    age: 21,
    city: "Karachi",
    attendance: true,
    marks: [88, 85, 90],
  },
];

// DOM
const output = document.getElementById("output");

const addBtn = document.getElementById("addBtn");

const searchInput = document.getElementById("searchInput");

const showBtn = document.getElementById("showBtn");

const sortBtn = document.getElementById("sortBtn");

const exportBtn = document.getElementById("exportBtn");

// Dashboard
const totalStudents = document.getElementById("totalStudents");

const passedStudents = document.getElementById("passedStudents");

const failedStudents = document.getElementById("failedStudents");

const topStudentText = document.getElementById("topStudent");

// ============================
// SAVE
// ============================

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

// ============================
// TOTAL
// ============================

function calculateTotal(marks) {
  return marks.reduce((a, b) => a + b, 0);
}

// ============================
// GRADE
// ============================

function getGrade(total) {
  if (total >= 240) return "A";

  if (total >= 210) return "B";

  if (total >= 180) return "C";

  return "F";
}

// ============================
// RESULT
// ============================

function getResult(total, attendance) {
  return total >= 180 && attendance ? "Pass" : "Fail";
}

// ============================
// DASHBOARD
// ============================

function updateDashboard() {
  totalStudents.innerText = students.length;

  let passed = 0;

  let failed = 0;

  let topper = students[0];

  students.forEach((student) => {
    let total = calculateTotal(student.marks);

    if (getResult(total, student.attendance) === "Pass") {
      passed++;
    } else {
      failed++;
    }

    if (calculateTotal(student.marks) > calculateTotal(topper.marks)) {
      topper = student;
    }
  });

  passedStudents.innerText = passed;

  failedStudents.innerText = failed;

  topStudentText.innerText = topper.name;
}

// ============================
// DISPLAY
// ============================

function displayStudents(data = students) {
  output.innerHTML = "";

  data.forEach((student, index) => {
    let total = calculateTotal(student.marks);

    let grade = getGrade(total);

    let result = getResult(total, student.attendance);

    output.innerHTML += `

      <div class="student-card">

        <div class="student-header">

          <h3>${student.name}</h3>

          <span class="badge ${result === "Pass" ? "pass" : "fail"}">

            ${result}

          </span>

        </div>

        <div class="student-info">

          <p><strong>Age:</strong> ${student.age}</p>

          <p><strong>City:</strong> ${student.city}</p>

          <p><strong>Marks:</strong> ${student.marks.join(", ")}</p>

          <p><strong>Total:</strong> ${total}</p>

          <p><strong>Grade:</strong> ${grade}</p>

          <p>
            <strong>Attendance:</strong>
            ${student.attendance ? "Present" : "Absent"}
          </p>

        </div>

        <div class="student-actions">

          <button
            class="edit-btn"
            onclick="editStudent(${index})"
          >
            Edit
          </button>

          <button
            class="delete-btn"
            onclick="deleteStudent(${index})"
          >
            Delete
          </button>

        </div>

      </div>

    `;
  });

  updateDashboard();

  updateChart();
}

// ============================
// ADD
// ============================

addBtn.addEventListener("click", () => {
  let name = document.getElementById("name").value;

  let age = document.getElementById("age").value;

  let city = document.getElementById("city").value;

  let m1 = Number(document.getElementById("m1").value);

  let m2 = Number(document.getElementById("m2").value);

  let m3 = Number(document.getElementById("m3").value);

  let attendance = document.getElementById("attendance").value === "true";

  if (!name || !age || !city) {
    alert("Please fill all fields");
    return;
  }

  students.push({
    name,
    age,
    city,
    attendance,
    marks: [m1, m2, m3],
  });

  saveData();

  displayStudents();

  clearForm();
});

// ============================
// CLEAR
// ============================

function clearForm() {
  document.getElementById("name").value = "";

  document.getElementById("age").value = "";

  document.getElementById("city").value = "";

  document.getElementById("m1").value = "";

  document.getElementById("m2").value = "";

  document.getElementById("m3").value = "";
}

// ============================
// DELETE
// ============================

function deleteStudent(index) {
  let check = confirm("Delete student?");

  if (check) {
    students.splice(index, 1);

    saveData();

    displayStudents();
  }
}

// ============================
// EDIT
// ============================

function editStudent(index) {
  let student = students[index];

  let name = prompt("Enter Name", student.name);

  let age = prompt("Enter Age", student.age);

  let city = prompt("Enter City", student.city);

  let m1 = prompt("Marks 1", student.marks[0]);

  let m2 = prompt("Marks 2", student.marks[1]);

  let m3 = prompt("Marks 3", student.marks[2]);

  students[index] = {
    ...student,

    name,

    age,

    city,

    marks: [Number(m1), Number(m2), Number(m3)],
  };

  saveData();

  displayStudents();
}

// ============================
// SEARCH
// ============================

searchInput.addEventListener("keyup", () => {
  let value = searchInput.value.toLowerCase();

  let filtered = students.filter((student) =>
    student.name.toLowerCase().includes(value),
  );

  displayStudents(filtered);
});

// ============================
// SORT
// ============================

sortBtn.addEventListener("click", () => {
  students.sort((a, b) => {
    return calculateTotal(b.marks) - calculateTotal(a.marks);
  });

  displayStudents();
});

// ============================
// SHOW ALL
// ============================

showBtn.addEventListener("click", () => {
  displayStudents();
});

// ============================
// EXPORT JSON
// ============================

exportBtn.addEventListener("click", () => {
  let data = JSON.stringify(students, null, 2);

  let blob = new Blob([data], {
    type: "application/json",
  });

  let a = document.createElement("a");

  a.href = URL.createObjectURL(blob);

  a.download = "students-data.json";

  a.click();
});

// ============================
// DARK MODE
// ============================

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ============================
// CHART
// ============================

let chart;

function updateChart() {
  let labels = students.map((student) => student.name);

  let totals = students.map((student) => calculateTotal(student.marks));

  if (chart) {
    chart.destroy();
  }

  const ctx = document.getElementById("studentChart");

  chart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Student Marks",

          data: totals,

          backgroundColor: [
            "#4f46e5",
            "#06b6d4",
            "#16a34a",
            "#f59e0b",
            "#dc2626",
          ],
        },
      ],
    },

    options: {
      responsive: true,
    },
  });
}

// ============================
// INITIAL
// ============================

displayStudents();
