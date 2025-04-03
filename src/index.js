import "./styles.css";
import { createTodo, createProject } from "./domLogic";

if (localStorage.getItem("projectBin")){
} else {
    localStorage.setItem("projectBin", JSON.stringify([]));
};

localStorage.setItem("project", "Default");

const content = document.querySelector('#content');
const projectDiv = document.querySelector('.project');
const projectList = document.querySelector('.project-list');
const projectSelect = document.querySelector('#project-select');

class Todo {
    constructor(title, description = '', dueDate = '', priority = '') {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    };

    set title(value){
        value = value.trim();
        if (value.length < 1){
            throw new Error("Please enter a title");
        }
        this._title = value;
    }

    get title(){
        return this._title;
    }
};

class Project {
    constructor(title) {
        this.title = title;
        this.todos = [];
    }

    set title(value){
        value = value.trim();
        if (value.length < 1){
            throw new Error("Please enter a title");
        }
        this._title = value;
    }

    get title(){
        return this._title;
    }
}

for (let i = 0; i < localStorage.length; i++){
    if (Array.isArray(JSON.parse(localStorage.getItem(localStorage.key(i))))){
        continue;
    }
    let item = JSON.parse((localStorage.getItem(localStorage.key(i)))); // even if i set the prototype of Todo get and set still wont work. i dont get it.
    item.title = item._title; // please...
    content.appendChild(createTodo(item));
}

let projectBin = JSON.parse(localStorage.getItem("projectBin"));
for (let i = 0; i < projectBin.length; i++) {
    projectBin[i].title = projectBin[i]._title;
    projectList.appendChild(createProject(projectBin[i]));
}

function dummytodo(){
    let bob = new Todo("joe", "jooo baiden", "yesterday", "omegadontcare");
    console.log(bob);
    /* content.appendChild(createTodo(bob)); */
    return bob;
};/* dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo(); */

export { content, projectDiv, projectList, projectSelect, Todo, Project };