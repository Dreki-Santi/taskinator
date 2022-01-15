
//LEARNING MOMENT
/*
console.dir(window.document);

window.document.querySelector("button");

var btn = window.document.querySelector("button");
console.dir(btn);

var buttonEl = document.querySelector("#save-task");
console.log(buttonEl);*/
//---------------------------------------------------

//Start
var taskIdCounter = 0;

var pageMainEl = document.querySelector("#page-content");

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");



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


formEl.addEventListener("submit", taskFormHandler);

// finds specific <button>
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

pageMainEl.addEventListener("click", taskButtonHandler);