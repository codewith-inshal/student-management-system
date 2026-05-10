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

const totalStudents = document.getElementById("totalStudents");

const passedStudents = document.getElementById("passedStudents");

const failedStudents = document.getElementById("failedStudents");

const topStudentText = document.getElementById("topStudent");

// TOAST
function showToast(message, color = "#16a34a") {
  const toast = document.getElementById("toast");

  toast.innerText = message;

  toast.style.background = color;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// SAVE
function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

// TOTAL
function calculateTotal(marks) {
  return marks.reduce((a, b) => a + b, 0);
}

// PERCENTAGE
function getPercentage(total) {
  return ((total / 300) * 100).toFixed(1);
}

// GRADE
function getGrade(total) {
  if (total >= 240) return "A";

  if (total >= 210) return "B";

  if (total >= 180) return "C";

  return "F";
}

// REMARKS
function getRemarks(percentage) {
  if (percentage >= 90) return "Excellent";

  if (percentage >= 75) return "Very Good";

  if (percentage >= 60) return "Good";

  if (percentage >= 40) return "Average";

  return "Poor";
}

// RESULT
function getResult(total, attendance) {
  return total >= 180 && attendance ? "Pass" : "Fail";
}

// DASHBOARD
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

    if (total > calculateTotal(topper.marks)) {
      topper = student;
    }
  });

  passedStudents.innerText = passed;

  failedStudents.innerText = failed;

  topStudentText.innerText = topper?.name || "-";
}

// DISPLAY
function displayStudents(data = students) {
  output.innerHTML = "";

  data.forEach((student, index) => {
    let total = calculateTotal(student.marks);

    let percentage = getPercentage(total);

    let grade = getGrade(total);

    let remarks = getRemarks(percentage);

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

          <p><strong>Percentage:</strong> ${percentage}%</p>

          <p><strong>Grade:</strong> ${grade}</p>

          <p><strong>Remarks:</strong> ${remarks}</p>

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

// ADD
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

  showToast("Student Added Successfully");
});

// CLEAR
function clearForm() {
  document.getElementById("name").value = "";

  document.getElementById("age").value = "";

  document.getElementById("city").value = "";

  document.getElementById("m1").value = "";

  document.getElementById("m2").value = "";

  document.getElementById("m3").value = "";
}

// DELETE
function deleteStudent(index) {
  let check = confirm("Delete Student?");

  if (check) {
    students.splice(index, 1);

    saveData();

    displayStudents();

    showToast("Student Deleted", "#dc2626");
  }
}

// MODAL
let currentEditIndex = null;

const modal = document.getElementById("editModal");

// EDIT
function editStudent(index) {
  currentEditIndex = index;

  let student = students[index];

  document.getElementById("editName").value = student.name;

  document.getElementById("editAge").value = student.age;

  document.getElementById("editCity").value = student.city;

  document.getElementById("editM1").value = student.marks[0];

  document.getElementById("editM2").value = student.marks[1];

  document.getElementById("editM3").value = student.marks[2];

  document.getElementById("editAttendance").value = student.attendance;

  modal.style.display = "flex";
}

// SAVE EDIT
document.getElementById("saveEdit").addEventListener("click", () => {
  students[currentEditIndex] = {
    ...students[currentEditIndex],

    name: document.getElementById("editName").value,

    age: document.getElementById("editAge").value,

    city: document.getElementById("editCity").value,

    attendance: document.getElementById("editAttendance").value === "true",

    marks: [
      Number(document.getElementById("editM1").value),

      Number(document.getElementById("editM2").value),

      Number(document.getElementById("editM3").value),
    ],
  };

  saveData();

  displayStudents();

  modal.style.display = "none";

  showToast("Student Updated", "#f59e0b");
});

// CLOSE MODAL
document.getElementById("closeModal").addEventListener("click", () => {
  modal.style.display = "none";
});

// SEARCH
searchInput.addEventListener("keyup", () => {
  let value = searchInput.value.toLowerCase();

  let filtered = students.filter((student) =>
    student.name.toLowerCase().includes(value),
  );

  displayStudents(filtered);
});

// SORT
sortBtn.addEventListener("click", () => {
  students.sort((a, b) => {
    return calculateTotal(b.marks) - calculateTotal(a.marks);
  });

  displayStudents();
});

// SHOW
showBtn.addEventListener("click", () => {
  displayStudents();
});

// EXPORT
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

// DARK MODE
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// CHART
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
      labels,

      datasets: [
        {
          label: "Student Total Marks",

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

// INITIAL
displayStudents();
