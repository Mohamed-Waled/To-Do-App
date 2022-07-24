let input = document.querySelector(".input");
let button = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let clearAll = document.querySelector(".btn");
let form = document.querySelector("form");

// Prevent Form Default Action
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

// To Focus After The Load
window.onload = () => {
  input.focus();
};

// Empty Array To Store The Tasks
let arrayOfTasks = [];

// Check If There Is Tasks In Local Storage
if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
} else {
  // If There is No Tasks Tell The User
  let task = document.createElement("div");
  let taskName = document.createTextNode("There Is No Tasks");
  task.append(taskName);
  tasksDiv.append(task);
  task.classList.add("empty");
}

// Call Get Data From Local Storage Function
getDataFromLocalStorage();

// Add Task
button.addEventListener("click", () => {
  if (input.value !== "") {
    addTaskToArray(input.value); // Add Task To Array Of Tasks
    input.value = ""; // Empty Input Field
  }
  window.sessionStorage.setItem("input", ""); // Empty The Input Field When I Click The Button
  input.focus();
});

// Click On Task Element
tasksDiv.addEventListener("click", (e) => {
  // Delete Button
  if (e.target.classList.contains("remove")) {
    // Remove Task From Local Storage
    deleteTask(e.target.parentElement.getAttribute("data-id"));
    // Remove Element From Page
    e.target.parentElement.remove();
    // If The LocalStorage Is Empty Tell The User
    if (localStorage.getItem("tasks") === "[]") {
      localStorage.clear();
      let task = document.createElement("div");
      let taskName = document.createTextNode("There Is No Tasks");
      task.append(taskName);
      tasksDiv.append(task);
      task.classList.add("empty");
    }
  }
  // Task Element
  if (e.target.classList.contains("task")) {
    // Toggle Completed For The Task
    toggleStatusTask(e.target.getAttribute("data-id"));
    // Toggle Done Class
    e.target.classList.toggle("done");
  }
});

function addTaskToArray(taskText) {
  // Task Data
  let task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  // Push Task To Array Of Tasks
  arrayOfTasks.push(task);
  // Add Tasks To Page
  addElementsToPage(arrayOfTasks);
  // Add Tasks To Local Storage
  addDataToLocalStorage(arrayOfTasks);
}

function addElementsToPage(arrayOfTasks) {
  // Empty Tasks Div
  tasksDiv.innerHTML = "";
  // Looping On Array Of TAsks
  arrayOfTasks.forEach((task) => {
    // Create Main Div
    let div = document.createElement("div");
    div.classList.add("task");
    // Check If Task Is Done
    if (task.completed) {
      div.classList.add("task", "done");
    }
    div.setAttribute("data-id", task.id);
    div.append(document.createTextNode(task.title));
    // Create Delete Button
    let button = document.createElement("button");
    button.classList.add("remove");
    button.append(document.createTextNode("Delete"));
    // Append Button to Main Div
    div.append(button);
    // Add Task Div To Tasks Div
    tasksDiv.append(div);
  });
}

function addDataToLocalStorage(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function getDataFromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElementsToPage(tasks);
  }
}

function deleteTask(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addDataToLocalStorage(arrayOfTasks);
}

function toggleStatusTask(taskId) {
  arrayOfTasks.forEach((task) => {
    if (task.id == taskId) {
      task.completed == false
        ? (task.completed = true)
        : (task.completed = false);
    }
  });
  addDataToLocalStorage(arrayOfTasks);
}

// Save The Input If We Refresh By Mistake
input.addEventListener("input", () => {
  window.sessionStorage.setItem("input", input.value);
});

// Get The Input If We Refresh By Mistake
if (window.sessionStorage.getItem("input")) {
  input.value = window.sessionStorage.getItem("input");
}

// Clear All Tasks Button
clearAll.addEventListener("click", () => {
  window.localStorage.clear(); // Empty The Local Storage
  window.sessionStorage.clear(); // Empty The Session Storage
  window.location.reload();
});
