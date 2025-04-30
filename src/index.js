import "./styles.css";
import { createTodo, createProject, getDate } from "./domLogic";
import { compareAsc } from "date-fns";

const CURRENT_TIME = new Date(); // im not sure if i even need this or if its good practice but whatever

localStorage.removeItem("project");

const content = document.querySelector("#content");
const projectDiv = document.querySelector(".project");
const projectList = document.querySelector(".project-list");
const projectSelect = document.querySelector("#project-select");
const currentProject = document.querySelector(".current-project");

class Todo {
  constructor(
    title,
    description = "",
    dueDate = "",
    priority = "",
    type = "todo"
  ) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
    this.type = type;
    this.expired = false;
  }
}

class Project {
  constructor(title) {
    this.title = title;
    this.todos = [];
    this.type = "project";
  }
}

currentProject.textContent = "Main page";
for (let i = 0; i < localStorage.length; i++) {
  let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
  if (item.type == "project") {
    projectList.appendChild(createProject(item));
    continue;
  } else if (localStorage.key(i) == "project"){
    continue;
  }
  item.dueDate = getDate(item.timestamp);
  if(compareAsc(item.timestamp, CURRENT_TIME) != 1){
    item.expired = true; // doesnt update in localStorage so we re-set it
    localStorage.setItem(item.id, JSON.stringify(item));
  }
  content.appendChild(createTodo(item));
}

export { content, projectDiv, projectList, projectSelect, currentProject, CURRENT_TIME, Todo, Project };
