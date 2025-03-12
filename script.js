let GTasks = [];

// Function to load tasks from localStorage and render them
function loadTasks() {
  const STOREDTASKS = localStorage.getItem('tasks');
  // If tasks exist in localStorage, parse them and render
  if (STOREDTASKS) {
    GTasks = JSON.parse(STOREDTASKS);
    renderTasks();
  }
}

// Function to check if a task already exists based on name, date, and time
function checkDuplicate(p_strName, p_dateDate, p_timeTime) {
  let LTaskExists = GTasks.some(task =>
    task.name === p_strName && task.date === p_dateDate && task.time === p_timeTime
  );
  // If duplicate found, alert the user and exit
  if (LTaskExists) {
    alert("This task already exists.");
    return;
  }
}

// Function to check if all required input values are filled in
function checkInputValue(p_strName, p_dateDate, p_timeTime) {
  if (!p_strName || !p_dateDate || !p_timeTime) {
    alert("Please fill in all fields.");
    return;
  }
}

// Function to add a new task
function addTask() {
  const TASKNAME = document.getElementById("taskName").value;
  const TASKDATE = document.getElementById("taskDate").value;
  const TASKTIME = document.getElementById("taskTime").value;

  // Check input values and check if task already exists
  checkInputValue(TASKNAME, TASKDATE, TASKTIME);
  checkDuplicate(TASKNAME, TASKDATE, TASKTIME);

  const TASK = {
    name: TASKNAME,
    date: TASKDATE,
    time: TASKTIME,
    status: "none", // "none" (remaining), "true" (completed), "false" (missing)
  };

  // Add task to the global task array and save to localStorage
  GTasks.push(TASK);
  localStorage.setItem('tasks', JSON.stringify(GTasks));
  renderTasks(); // Re-render tasks after addition
  resetInputFields(); // Reset input fields after adding
}

// Function to render tasks to the HTML table
function renderTasks(filter = null) {
  const TABLEBODY = document.getElementById("taskTable").getElementsByTagName("tbody")[0];
  TABLEBODY.innerHTML = ''; // Clear previous tasks in the table

  // Filter tasks based on status or display all
  const FILTEREDTASKS = filter === null ? GTasks : GTasks.filter(TASK => {
    if (filter === 'false') {
      return TASK.status === "none" && isTaskOverdue(TASK.date); // Show overdue tasks
    }
    return TASK.status === filter; // Filter tasks by status (remaining, completed)
  });

  // Loop through filtered tasks and create table rows
  FILTEREDTASKS.forEach((TASK, index) => {
    const ISMISSING = TASK.status === "none" && isTaskOverdue(TASK.date);

    const ROW = TABLEBODY.insertRow();
    ROW.innerHTML = `<td style="text-align: center;">
        <input type="radio" ${TASK.status === "true" ? 'checked' : ''} onclick="toggleTaskStatus(${index})" />
      </td>
      <td style="text-align: center;" class="${TASK.status === "true" ? 'strike' : (ISMISSING ? 'missing' : '')}">${TASK.name}</td>
      <td style="text-align: center;">${TASK.date} ${TASK.time}</td>
      <td style="text-align: center;">${TASK.status === "true" ? "Completed" : ISMISSING ? "Missing" : "Remaining"}</td>
      <td style="text-align: center;">
        <button onclick="editTask(${index})" class="edit-color edit-del-btn">Edit</button>
        <button onclick="deleteTask(${index})" class="delete-color edit-del-btn">Delete</button>
      </td>
    `;
  });
}

// Function to reset input fields after task is added or edited
function resetInputFields() {
  document.getElementById("taskName").value = '';
  document.getElementById("taskDate").value = '';
  document.getElementById("taskTime").value = '';
}

// Function to toggle the task's completion status (from remaining to completed)
function toggleTaskStatus(P_numIndex) {
  const TASK = GTasks[P_numIndex];
  TASK.status = TASK.status === "none" ? "true" : "none"; // Change status between "none" and "true"
  localStorage.setItem('tasks', JSON.stringify(GTasks)); // Save updated tasks
  renderTasks(); // Re-render tasks
}

// Function to delete a task from the list
function deleteTask(P_numIndex) {
  GTasks.splice(P_numIndex, 1); // Remove task from the array
  localStorage.setItem('tasks', JSON.stringify(GTasks)); // Save updated tasks
  renderTasks(); // Re-render tasks
}

// Function to edit a task: Pre-fill the task details in the input fields
function editTask(P_numIndex) {
  const TASK = GTasks[P_numIndex];
  document.getElementById("taskName").value = TASK.name;
  document.getElementById("taskDate").value = TASK.date;
  document.getElementById("taskTime").value = TASK.time;

  const ADDTASKBUTTON = document.getElementById("addTaskButton");
  ADDTASKBUTTON.textContent = "Update Task"; // Change button text to "Update Task"
  ADDTASKBUTTON.onclick = function() {
    updateTask(P_numIndex); // Update the task when the button is clicked
  };
}

// Function to update an existing task
function updateTask(P_numIndex) {
  const TASKNAME = document.getElementById("taskName").value;
  const TASKDATE = document.getElementById("taskDate").value;
  const TASKTIME = document.getElementById("taskTime").value;

  // Check input values and check for duplicates
  checkInputValue(TASKNAME, TASKDATE, TASKTIME);
  checkDuplicate(TASKNAME, TASKDATE, TASKTIME);

  // Update the task's information
  GTasks[P_numIndex] = {
    ...GTasks[P_numIndex],
    name: TASKNAME,
    date: TASKDATE,
    time: TASKTIME
  };

  resetInputFields(); // Reset input fields after updating

  const ADDTASKBUTTON = document.getElementById("addTaskButton");
  ADDTASKBUTTON.textContent = "Add Task"; // Reset button text to "Add Task"
  ADDTASKBUTTON.onclick = addTask; // Reset button's onclick to addTask function

  localStorage.setItem('tasks', JSON.stringify(GTasks)); // Save updated tasks
  renderTasks(); // Re-render tasks after updating
}

// Function to filter tasks based on their status (all, remaining, completed, missing)
function filterTasks(p_strStatus) {
  renderTasks(p_strStatus === 'all' ? null : p_strStatus); // Render tasks based on filter
}

// Function to clear all tasks (remove from the array and localStorage)
function clearTasks() {
  GTasks = []; // Clear the global task array
  localStorage.removeItem('tasks'); // Remove tasks from localStorage
  renderTasks(); // Re-render tasks (which will be empty now)
}

// Function to check if a task is overdue based on its date
function isTaskOverdue(p_dateTASKDATE) {
  const TASKDATEOBJ = new Date(p_dateTASKDATE);
  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0); // Set the time to midnight to ignore time in comparison
  return TASKDATEOBJ < TODAY; // If the task date is earlier than today, it is overdue
}

// Load tasks from localStorage when the page is loaded
window.onload = loadTasks;
