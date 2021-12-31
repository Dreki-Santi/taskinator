
//LEARNING MOMENT
/*
console.dir(window.document);

window.document.querySelector("button");

var btn = window.document.querySelector("button");
console.dir(btn);
*/
var buttonEl = document.querySelector("#save-task");
console.log(buttonEl);
//---------------------------------------------------

//Start
var buttonEl = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task.";
    tasksToDoEl.appendChild(listItemEl);
}

buttonEl.addEventListener("click", createTaskHandler);