import {
  content,
  projectDiv,
  projectList,
  projectSelect,
  currentProject,
  Todo,
  Project,
  CURRENT_TIME,
} from "./index";

import { compareAsc, formatRelative, isSameDay, isSameMinute, isSameMonth, isSameWeek, isTomorrow } from "date-fns";

const dialogCreateTodo = document.querySelector(".dialog-todo");
const dialogCreateProject = document.querySelector(".dialog-project");
const addTodoBtn = document.querySelector(".add");
const addProjectBtn = document.querySelector(".btn-add-project");
const closeModal = document.querySelectorAll(".close"); // idiot
const prioTextInput = document.querySelector("#priority");
const prioColorInput = document.querySelector("#prio-color");
const dateInput = document.querySelector("#due-date");
const inputsProject = document.querySelectorAll(".form-project > input");
const inputs = document.querySelectorAll("form > input"); // i dont know about this
const dialogNuke = document.querySelector(".dialog-nuke");
const contentDueToday = document.querySelector(".due-today > .due-content");
const contentDueTomorrow = document.querySelector(".due-tomorrow > .due-content");
const contentDueWeek = document.querySelector(".due-week > .due-content");
const contentDueMonth = document.querySelector(".due-month > .due-content");
const contentDueLater = document.querySelector(".due-later > .due-content");
const contentDueExpired = document.querySelector(".due-expired > .due-content");
const contentAll = Array.from([ 
  contentDueToday,
  contentDueTomorrow,
  contentDueWeek,
  contentDueMonth,
  contentDueLater,
  contentDueExpired])

const closeNukeBtn = document.querySelector(".nuke-close");
closeNukeBtn.addEventListener("click", ()=>{
  dialogNuke.close();
})

const confirmNukeBtn = document.querySelector(".nuke-confirm");
confirmNukeBtn.addEventListener("click", () => {
  localStorage.clear();
  dialogNuke.close();
  location.reload();
})

const nukeBtn = document.querySelector(".nuke");
nukeBtn.addEventListener("click", ()=>{
  dialogNuke.showModal();
})

let inputsTodo = document.querySelectorAll(".form-todo > input");
inputsTodo = Array.from(inputsTodo);
inputsTodo.push(prioTextInput);

const mainProject = document.querySelector(".main-page-li");
mainProject.addEventListener("click", () => {
  contentAll.forEach((element)=>{
    clearContent(element);
  })
  currentProject.textContent = "Main page";
  localStorage.removeItem("project");
  for (let i = 0; i < localStorage.length; i++) {
    let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (item.type == "project" || localStorage.key(i) == "project") {
      continue;
    }
    if (item.timestamp){
      sortDues(item.timestamp, item);
    } else {
      content.appendChild(createTodo(item));
    }
  }
});

function createTodo(object) {
  let div = document.createElement("div");
  let h2 = document.createElement("h2");
  let p = document.createElement("p");
  let footer = document.createElement("footer");
  let dueSpan = document.createElement("span");
  let prioSpan = document.createElement("span");
  let completedBtn = document.createElement("button");
  let removeBtn = document.createElement("button");

  footer.appendChild(dueSpan);
  footer.appendChild(prioSpan);
  footer.appendChild(completedBtn);
  footer.appendChild(removeBtn);

  completedBtn.addEventListener("click", () => {
    if (object.completed) {
      return;
    }
    object.completed = true;
    div.style.opacity = 0.5;
    localStorage.setItem(object.id, JSON.stringify(object));
  });

  removeBtn.addEventListener("click", () => {
    div.parentElement.removeChild(div);
    localStorage.removeItem(object.id);
    if (object.project){
      let project = JSON.parse(localStorage.getItem(object.project));
      project.todos.splice(object.index, 1);
      localStorage.setItem(project.id, JSON.stringify(project));
    }
  });

  div.appendChild(h2);
  div.appendChild(p);
  div.appendChild(footer);

  h2.textContent = object.title;
  p.textContent = object.description;
  dueSpan.textContent = object.dueDate;
  prioSpan.textContent = object.priority;
  completedBtn.textContent = "Mark as completed";
  removeBtn.textContent = "X";
  if (object.priorityColor != "#000000") {
    prioSpan.style.backgroundColor = object.priorityColor;
  }

  if (object.completed) {
    div.style.opacity = 0.5;
  }

  if (object.expired) {
    div.style.outline = "1px solid red";
  }

  div.classList.add("todo");

  return div;
}

function createProject(object) {
  let p = document.createElement("p");
  let li = document.createElement("li");
  let btn = document.createElement("button");
  btn.textContent = "X";
  btn.setAttribute("hidden", "");
  btn.addEventListener("click", (Event) => {
    Event.stopPropagation();
    contentAll.forEach((element)=>{
      clearContent(element);
    })
    projectList.removeChild(li);
    localStorage.removeItem(object.id);
    mainProject.dispatchEvent(new MouseEvent("click"));
  });
  li.appendChild(p);
  li.appendChild(btn);
  p.textContent = object.title;
  li.addEventListener("click", () => {
    contentAll.forEach((element)=>{
      clearContent(element);
    })
    localStorage.setItem("project", object.id);
    JSON.parse(
      localStorage.getItem(localStorage.getItem("project"))
    ).todos.forEach((id) => {
      if (JSON.parse(localStorage.getItem(id)).timestamp){
        sortDues(JSON.parse(localStorage.getItem(id)).timestamp, JSON.parse(localStorage.getItem(id)));
      } else {
        content.appendChild(createTodo(JSON.parse(localStorage.getItem(id))));
      }
    });
    currentProject.textContent = p.textContent;
  });

  li.addEventListener("mouseover", () => {
    li.lastChild.removeAttribute("hidden");
  });

  li.addEventListener("mouseleave", () => {
    li.lastChild.setAttribute("hidden", "");
  });

  return li;
}

addTodoBtn.addEventListener("click", () => {
  dialogCreateTodo.showModal();
});

addProjectBtn.addEventListener("click", () => {
  dialogCreateProject.showModal();
});

// actual idiot
closeModal.forEach((button) => { // better way to do this?
  button.addEventListener("click", () => {
    button.parentElement.parentElement.parentElement.close(); // ok
    inputs.forEach((node) => { // doesnt look like it belongs here
      node.value = "";
    });
  });
});

const projectForm = document.querySelector(".form-project");
projectForm.addEventListener("submit", () => {
  let array = [];
  inputsProject.forEach((node) => {
    array.push(node.value);
    node.value = "";
  });
  
  let project = new Project(array[0]);
  project.id = generateId();

  projectList.appendChild(createProject(project));
  localStorage.setItem(project.id, JSON.stringify(project));
});

const todoForm = document.querySelector(".form-todo");
todoForm.addEventListener("submit", () => {
  let array = [];
  let timestamp = dateInput.value;
  if (dateInput.value == "") {
    timestamp = null;
  }

  inputsTodo.forEach((node) => {
    array.push(node.value);
    node.value = "";
  });

  array[2] = getDate(timestamp);

  let todo = new Todo(array[0], array[1], array[2], array[3]);
  todo.priorityColor = prioColorInput.value;
  prioColorInput.value = "";

  todo.timestamp = timestamp;

  todo.id = generateId();

  if (todo.timestamp){
    sortDues(timestamp, todo);
  } else {
    content.appendChild(createTodo(todo));
  }
 
  if (localStorage.getItem("project")) {
    let project = JSON.parse(
      localStorage.getItem(localStorage.getItem("project"))
    ); // its 12 pm im not even going to question it
    project.todos.push(todo.id);
    todo.index = project.todos.indexOf(todo.id);
    todo.project = project.id;
    localStorage.setItem(project.id, JSON.stringify(project));
  }

  localStorage.setItem(todo.id, JSON.stringify(todo));
});

function clearContent(element) {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
}

// dateTime === "YYYY-MM-DDTHH:mm"
function getDate(dateTime) {
  if (dateTime == "" || dateTime === null) return;
  let date = dateTime.split("-");
  let time = date[2].split("T");
  date.pop();
  date.push(time.shift());
  time = time[0].split(":");
  date[1] = date[1] - 1; // month indices begin at 0 lol okay
  let finalDate = formatRelative(
    new Date(date[0], date[1], date[2], time[0], time[1]),
    CURRENT_TIME
  );

  return finalDate;
}

 // oh well
function sortDues(timestamp, todo){
  if (todo.expired){
    contentDueExpired.appendChild(createTodo(todo));
  } else if (isSameDay(timestamp, CURRENT_TIME)){
    contentDueToday.appendChild(createTodo(todo));
  } else if (isSameWeek(timestamp, CURRENT_TIME)){
    if (isTomorrow(timestamp)){
      contentDueTomorrow.appendChild(createTodo(todo));
    } else {
      contentDueWeek.appendChild(createTodo(todo));
    }
  } else if (isSameMonth(timestamp, CURRENT_TIME)){
    contentDueMonth.appendChild(createTodo(todo));
  } else {
    contentDueLater.appendChild(createTodo(todo));
  }
}

// generate a unique id and use it to reference the object
function generateId(){
  let id = Math.random().toString();
  id = id.split(".");
  id = id[1];

  return id;
}

export { createTodo, createProject, getDate, sortDues, contentAll};
