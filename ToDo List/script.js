let totalTasks = 0;
let completedTasks = 0;

// Display current date in DD/MM/YYYY format
function displayCurrentDate() {
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
    today.getMonth() + 1
  ).padStart(2, '0')}/${today.getFullYear()}`;
  document.getElementById("current-date").textContent = formattedDate;
}

// Update stats and progress bar
function updateTaskStats() {
  document.getElementById("tasks-completed").textContent = completedTasks;
  document.getElementById("total-tasks").textContent = totalTasks;

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  document.getElementById("progress-bar").style.width = `${progress}%`;
}

// Add a task
function addTask(taskText) {
  totalTasks++;
  updateTaskStats();

  const taskItem = document.createElement("div");
  taskItem.className = "task-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => moveToCompleted(taskItem, checkbox));

  const taskContent = document.createElement("div"); // Wrapper for task text and date
  taskContent.className = "task-content";

  const taskLabel = document.createElement("span");
  taskLabel.textContent = taskText;

  const dateTimeLabel = document.createElement("div");
  dateTimeLabel.className = "task-datetime";
  dateTimeLabel.textContent = `Added: ${getCurrentDateTime()}`;

  taskContent.appendChild(taskLabel);
  taskContent.appendChild(dateTimeLabel);

  const editButton = document.createElement("button");
  editButton.className = "edit";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => editTask(taskLabel));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteTask(taskItem, checkbox.checked));

  taskItem.appendChild(checkbox);
  taskItem.appendChild(taskContent);
  taskItem.appendChild(editButton);
  taskItem.appendChild(deleteButton);

  document.getElementById("pending-tasks").appendChild(taskItem);
}

// Edit task
function editTask(taskLabel) {
  const newTask = prompt("Edit your task:", taskLabel.textContent);
  if (newTask !== null) {
    taskLabel.textContent = newTask.trim();
  }
}

// Delete task
function deleteTask(taskItem, isCompleted) {
  taskItem.remove();
  totalTasks--;

  if (isCompleted) {
    completedTasks--;
  }

  updateTaskStats();
}

// Move to completed
function moveToCompleted(taskItem, checkbox) {
  const dateTimeLabel = taskItem.querySelector(".task-datetime");

  if (checkbox.checked) {
    completedTasks++;
    dateTimeLabel.textContent = `Completed: ${getCurrentDateTime()}`;
    document.getElementById("completed-tasks").appendChild(taskItem);
  } else {
    completedTasks--;
    dateTimeLabel.textContent = `Added: ${getCurrentDateTime()}`;
    document.getElementById("pending-tasks").appendChild(taskItem);
  }
  updateTaskStats();
}

// Get current date and time
function getCurrentDateTime() {
  const now = new Date();
  const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return `${date} ${time}`;
}

// Add task on button click
document.getElementById("add-task-btn").addEventListener("click", () => {
  const taskInput = document.getElementById("task-input");
  const taskText = taskInput.value.trim();

  if (taskText) {
    addTask(taskText);
    taskInput.value = "";
  }
});

displayCurrentDate();
updateTaskStats();
