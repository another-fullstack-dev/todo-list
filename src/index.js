import "./styles.css";
import { contentAll, totalPageLayout } from "./domLogic";
import { setDefaultOptions } from "date-fns";

setDefaultOptions({ weekStartsOn: 1 }); // set week start on monday

const CURRENT_TIME = new Date();

localStorage.removeItem("project");

const content = document.querySelector("#content");
const projectDiv = document.querySelector(".project");
const projectList = document.querySelector(".project-list");
const projectSelect = document.querySelector("#project-select");
const currentProject = document.querySelector(".current-project");
contentAll.push(content);

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
totalPageLayout();

export {
  content,
  projectDiv,
  projectList,
  projectSelect,
  currentProject,
  CURRENT_TIME,
  Todo,
  Project,
};
