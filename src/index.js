import "./styles.css";
import { createTodo, createProject } from "./domLogic";

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
  if (item.type == "project" || localStorage.key(i) == "project") {
    projectList.appendChild(createProject(item));
    currentProject.textContent = item.title;
    continue;
  }
  content.appendChild(createTodo(item));
}

export { content, projectDiv, projectList, projectSelect, currentProject, Todo, Project };
