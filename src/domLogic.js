import {
  content,
  projectDiv,
  projectList,
  projectSelect,
  Todo,
  Project,
} from "./index";

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
    localStorage.setItem(object.title, JSON.stringify(object));
  });

  removeBtn.addEventListener("click", () => {
    content.removeChild(div);
    localStorage.removeItem(object.title);
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

  if (object.completed) {
    div.style.opacity = 0.5;
  }

  div.classList.add("todo");

  return div;
}

const dialogCreateTodo = document.querySelector(".dialog-todo");
const dialogCreateProject = document.querySelector(".dialog-project");
const addTodoBtn = document.querySelector(".add");
const addProjectBtn = document.querySelector(".btn-add-project");
const closeModal = document.querySelectorAll(".close");
const inputsTodo = document.querySelectorAll(".form-todo > input");
const inputsProject = document.querySelectorAll(".form-project > input");
const inputs = document.querySelectorAll("form > input");

const mainProject = document.querySelector(".main-page-li");
mainProject.addEventListener("click", () => {
  clearContent();
  for (let i = 0; i < localStorage.length; i++) {
    let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (item.type == "project" || localStorage.key(i) == "project") {
      continue;
    }
    localStorage.removeItem("project");
    content.appendChild(createTodo(item));
  }
});

function createProject(object) {
  let p = document.createElement("p");
  let li = document.createElement("li");
  li.appendChild(p);
  p.textContent = object.title;
  li.addEventListener("click", () => {
    clearContent();
    localStorage.setItem("project", p.textContent);
    object.todos.forEach((todo) => {
      content.appendChild(createTodo(todo));
    });
  });

  return li;
}

addTodoBtn.addEventListener("click", () => {
  dialogCreateTodo.showModal();
});

addProjectBtn.addEventListener("click", () => {
  dialogCreateProject.showModal();
});

closeModal.forEach((button) => {
  button.addEventListener("click", () => {
    button.parentElement.parentElement.parentElement.close(); // ok
    inputs.forEach((node) => {
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
  localStorage.setItem(project.title, JSON.stringify(project));
});

const todoForm = document.querySelector(".form-todo");
todoForm.addEventListener("submit", () => {
  let array = [];
  inputsTodo.forEach((node) => {
    array.push(node.value);
    node.value = "";
  });
  let todo = new Todo(array[0], array[1], array[2], array[3]);
  content.appendChild(createTodo(todo));
  localStorage.setItem(todo.title, JSON.stringify(todo));
  if(localStorage.getItem("project")){
    let project = JSON.parse(localStorage.getItem(localStorage.getItem("project"))); // its 12 pm im not even going to question it
    project.todos.push(todo);
    localStorage.setItem(project.title, JSON.stringify(project));
  }
});

function clearContent() {
  while (content.lastChild) {
    content.removeChild(content.lastChild);
  }
}

export { createTodo, createProject };
