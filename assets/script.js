
//LEARNING MOMENT
/*
console.dir(window.document);

window.document.querySelector("button");

var btn = window.document.querySelector("button");
console.dir(btn);

var buttonEl = document.querySelector("#save-task");
console.log(buttonEl);*/
//---------------------------------------------------

// global Start
var taskIdCounter = 0;

var pageMainEl = document.querySelector("#page-content");

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// create array to hold tasks for saving
var tasks = [];

// functions start 

var taskFormHandler = function(event) {
    event.preventDefault();
    //console.log(event);

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    //console.dir(taskNameInput);
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if(!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    // check if task is new or one being edited by seeing if it has a data-task-id attribute
    var isEdit = formEl.hasAttribute("data-task-id");
    //console.log(isEdit);

    // has data attribute, so get id and call function to complete edit process
    if(isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    // no data attribute, so create object as normal and pass to createTaskEl()
    } else {
        // package up data as an object
        var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
        }

        // send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
}

var createTaskEl = function(taskDataObj) {
    //console.log(taskDataObj);
    //console.log(taskDataObj.status);

    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // add draggable functionality to the task items
    listItemEl.setAttribute("draggable", "true");

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    // add buttons and dropdown to the <li>
    var TaskActionsEl = createTaskActions(taskIdCounter);
    /*console.log(TaskActionsEl);*/
    listItemEl.appendChild(TaskActionsEl);

    switch(taskDataObj.status) {
        case "to do":
            TaskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.append(listItemEl);
            break;
        case "in progress":
            TaskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.append(listItemEl);
            break;
        case "completed":
            TaskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.append(listItemEl);
            break;
        default: 
        console.log("Something went wrong!");
    }

    // save task as an object with name, type, status, and id properties then push it into tasks array
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // save tasks to localStorage
    saveTasks();

    //increase task counter for the next unique id 
    taskIdCounter++;
}

var createTaskActions = function(taskId) {
    // create container to hold elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // create dropdown <select>
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // options for dropdown
    var statusChoices = ["To Do", "In Progress", "Complete"];
    for(var i = 0; i < statusChoices.length; i++) {
        // create <option> element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusOptionEl.textContent = statusChoices[i];

        // append to <select>
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
}

// Submitting task
formEl.addEventListener("submit", taskFormHandler);

// finds specific <button> function
var taskButtonHandler = function(event) {
    //console.log(event.target);

    // get target element from event
    var targetEl = event.target;

    // edit button is clicked
    if(targetEl.matches(".edit-btn")) {
        console.log.log("edit", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } else if(targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        // get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
}

var editTask = function(taskId) {
    console.log("edit task #" + taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" +taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    // write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // set data attribute to the form with a value of the task's id so it knows which one is being edited
    formEl.setAttribute("data-task-id", taskId);

    // update form's button to reflect editing a task rather than creating a new one
    formEl.querySelector("#save-task").textContent = "Save Task";
}

var completeEditTask = function(taskName, taskType, taskId) {
    //console.log(taskName, taskType, taskId);

    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for(var i = 0; i < tasks.length; i++) {
        if(tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert("Task is Updated!");

    // remove data attribute from form
    formEl.removeAttribute("data-task-id");
    // update formEl button to go back to saying "Add Task" instead of "Edit Task"
    document.querySelector("#save-task").textContent = "Add Task";
    
    // save tasks to localStorage
    saveTasks();
}

// deletes task
var deleteTask = function(taskId) {
    console.log(taskId);

    // find task list element with taskId value and remove it
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through the current tasks
    for(var i = 0; i < tasks.length; i++) {
        //if tasks[i].id does NOT match the value fo taskId, keep that task and push it into the new array
        if(tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
}

// edit or delete the referenced task
pageMainEl.addEventListener("click", taskButtonHandler);

var taskStatusChangeHandler = function(event) {
    console.log(event.target.value);
    //console.log(event.target.getAttribute("data-task-id"));

    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get the currently selected option's value and convert it to lowercase
    var statusValue = event.target.value.toLowerCase();

    // move to correct column based on selected option
    if(statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if(statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if(statusValue === "complete") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    //update task's in tasks array
    for(var i = 0; i < tasks.length; i++) {
        if(tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    //console.log(tasks);

    // save to localStorage
    saveTasks();
}

// moves task to correct progress column based on current selected option
pageMainEl.addEventListener("change", taskStatusChangeHandler);

// start of the drag task item functionality 
var dragTaskHandler = function(event) {
    //console.log("event.target:", event.target);
    //console.log("event.type", event.type);
    //console.log("event", event);

    var taskId = event.target.getAttribute("data-task-id");
    /*console.log("task id:", taskId);
    console.log("event", event);*/
    
    // store task id in datatransfer, which is a data storage property
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
    //console.log("getId:", getId, typeof getId);
}

pageMainEl.addEventListener("dragstart", dragTaskHandler);

var dropZoneDragHandler = function(event) {
    //console.log("Dragover event target:", event.target);

    // prevent the drop from snapping back to OG location, unless in the correct locations
    var taskListEl = event.target.closest(".task-list");
    if(taskListEl) {
        event.preventDefault();
        // verify drop zone
        //console.dir(taskListEl);

        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
}

pageMainEl.addEventListener("dragover", dropZoneDragHandler);

var dropTaskHandler = function(event) {
    event.preventDefault();

    var id = event.dataTransfer.getData("text/plain");
    //console.log("Drop event target:", event.target, event.dataTransfer, id);

    //locate the task item through unique id (data-task-id)
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    //console.log(draggableElement);
    //console.dir(draggableElement);

    // return the corresponding task list element of the drop zone
    var dropZonesEl = event.target.closest(".task-list");
    var statusType = dropZonesEl.id;
    //console.log(statusType);
    //console.dir(dropZonesEl);

    // set status of the task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    //console.log(statusSelectEl);
    //console.dir(statusSelectEl);

    if(statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    } else if(statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    } else if(statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }

    dropZonesEl.removeAttribute("style");

    dropZonesEl.appendChild(draggableElement);

    // loop through tasks array to find and update the updated task's status
    for(var i = 0; i < tasks.length; i++) {
        if(tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    //console.log(tasks);

    saveTasks();
}

pageMainEl.addEventListener("drop", dropTaskHandler);

// remove the css from the task columns
var dragLeaveHandler = function(event) {
    //console.dir(event.target);

    var taskListEl = event.target.closest(".task-list");
    if(taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

pageMainEl.addEventListener("dragleave", dragLeaveHandler);

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");
    // if there are no tasks, set tasks to an empty array and return out of the function
    if (!savedTasks) {
        return false;
    }
    console.log("Saved tasks found!");
    // else, load up saved tasks

    // parse into array of objects
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the `createTaskEl()` function
        createTaskEl(savedTasks[i]);
  }
}

loadTasks();