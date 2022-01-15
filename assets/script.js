
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

    // reset input values after submit
    formEl.reset();

    // check for form being given data-task-id attribute
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
        type: taskTypeInput
        }

        // send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
}

var createTaskEl = function(taskDataObj) {
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

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    //increase task counter for the next unique id 
    taskIdCounter++;
}

var createTaskActions = function(taskId) {
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
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

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
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    if(targetEl.matches(".delete-btn")) {
        // get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
}

var editTask = function(taskId) {
    //console.log("edit task #" + taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" +taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    //console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    //console.log(taskType);

    // edit task mode
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // update button to show "save task"
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
}

var completeEditTask = function(taskName, taskType, taskId) {
    //console.log(taskName, taskType, taskId);

    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task is Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

// deletes task
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    taskSelected.remove();
}

// edit or delete the referenced task
pageMainEl.addEventListener("click", taskButtonHandler);

var taskStatusChangeHandler = function(event) {
    /*console.log(event.target);
    console.log(event.target.getAttribute("data-task-id"));*/

    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert it to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // move to correct column based on selected option
    if(statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if(statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if(statusValue === "complete") {
        tasksCompletedEl.appendChild(taskSelected);
    }
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