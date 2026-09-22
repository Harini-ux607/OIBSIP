/* =========================
   GET HTML ELEMENTS
========================= */

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");

const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");


/* =========================
   TASK ARRAY
========================= */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


/* =========================
   ADD TASK
========================= */

addTaskButton.addEventListener("click", function () {

    addNewTask();

});


/* =========================
   ENTER KEY
========================= */

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addNewTask();

    }

});


/* =========================
   ADD NEW TASK FUNCTION
========================= */

function addNewTask() {

    const taskText = taskInput.value.trim();


    // Don't allow empty task
    if (taskText === "") {

        alert("Please enter a task.");

        return;

    }


    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false,

        createdAt: new Date().toLocaleString(),

        completedAt: null

    };


    tasks.push(newTask);


    saveTasks();

    displayTasks();


    // Clear input
    taskInput.value = "";

    taskInput.focus();

}


/* =========================
   DISPLAY TASKS
========================= */

function displayTasks() {

    pendingList.innerHTML = "";

    completedList.innerHTML = "";


    const pendingTasks = tasks.filter(function (task) {

        return task.completed === false;

    });


    const completedTasks = tasks.filter(function (task) {

        return task.completed === true;

    });


    /* =========================
       PENDING TASKS
    ========================= */

    if (pendingTasks.length === 0) {

        pendingList.innerHTML = `
            <p class="empty-message">
                No pending tasks. You're all caught up! 🎉
            </p>
        `;

    } else {

        pendingTasks.forEach(function (task) {

            createTaskElement(task, pendingList);

        });

    }


    /* =========================
       COMPLETED TASKS
    ========================= */

    if (completedTasks.length === 0) {

        completedList.innerHTML = `
            <p class="empty-message">
                No completed tasks yet.
            </p>
        `;

    } else {

        completedTasks.forEach(function (task) {

            createTaskElement(task, completedList);

        });

    }


    /* =========================
       COUNTS
    ========================= */

    pendingCount.textContent =
        pendingTasks.length + " pending";

    completedCount.textContent =
        completedTasks.length + " completed";

}


/* =========================
   CREATE TASK ELEMENT
========================= */

function createTaskElement(task, list) {

    const taskItem = document.createElement("div");

    taskItem.classList.add("task-item");


    if (task.completed) {

        taskItem.classList.add("completed");

    }


    /* =========================
       TASK CONTENT
    ========================= */

    const taskContent = document.createElement("div");

    taskContent.classList.add("task-content");


    const taskText = document.createElement("span");

    taskText.classList.add("task-text");

    taskText.textContent = task.text;


    const taskTime = document.createElement("small");

    taskTime.classList.add("task-time");

    taskTime.textContent =
        "Added: " + task.createdAt;


    if (task.completedAt !== null) {

        taskTime.textContent +=
            " | Completed: " + task.completedAt;

    }


    taskContent.appendChild(taskText);

    taskContent.appendChild(taskTime);


    /* =========================
       COMPLETE BUTTON
    ========================= */

    const completeButton = document.createElement("button");

    completeButton.classList.add(
        "task-button",
        "complete-button"
    );


    if (task.completed) {

        completeButton.textContent = "Undo";

    } else {

        completeButton.textContent = "Mark Complete";

    }


    completeButton.addEventListener("click", function () {

        toggleComplete(task.id);

    });


    /* =========================
       EDIT BUTTON
    ========================= */

    const editButton = document.createElement("button");

    editButton.classList.add(
        "task-button",
        "edit-button"
    );

    editButton.textContent = "Edit";


    editButton.addEventListener("click", function () {

        editTask(task.id);

    });


    /* =========================
       DELETE BUTTON
    ========================= */

    const deleteButton = document.createElement("button");

    deleteButton.classList.add(
        "task-button",
        "delete-button"
    );

    deleteButton.textContent = "Delete";


    deleteButton.addEventListener("click", function () {

        deleteTask(task.id);

    });


    /* =========================
       ADD EVERYTHING
    ========================= */

    taskItem.appendChild(taskContent);

    taskItem.appendChild(completeButton);

    taskItem.appendChild(editButton);

    taskItem.appendChild(deleteButton);


    list.appendChild(taskItem);

}


/* =========================
   MARK COMPLETE / UNDO
========================= */

function toggleComplete(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {

            task.completed = !task.completed;


            if (task.completed) {

                task.completedAt =
                    new Date().toLocaleString();

            } else {

                task.completedAt = null;

            }

        }

        return task;

    });


    saveTasks();

    displayTasks();

}


/* =========================
   EDIT TASK
========================= */

function editTask(id) {

    const task = tasks.find(function (task) {

        return task.id === id;

    });


    if (!task) {
        return;
    }


    const newText = prompt(
        "Edit your task:",
        task.text
    );


    if (newText === null) {
        return;
    }


    const updatedText = newText.trim();


    if (updatedText === "") {

        alert("Task cannot be empty.");

        return;

    }


    task.text = updatedText;


    saveTasks();

    displayTasks();

}


/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(function (task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


/* =========================
   LOCAL STORAGE
========================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* =========================
   LOAD TASKS
========================= */

displayTasks();