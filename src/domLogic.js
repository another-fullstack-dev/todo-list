import {
  content,
  projectDiv,
  projectList,
  projectSelect,
  currentProject,
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
    if (localStorage.getItem("project")) {
      let project = JSON.parse(
        localStorage.getItem(localStorage.getItem("project"))
      );
      project.todos[object.index].completed = true;
      localStorage.setItem(project.title, JSON.stringify(project));
    }
  });

  removeBtn.addEventListener("click", () => {
    content.removeChild(div);
    localStorage.removeItem(object.title);
    if (localStorage.getItem("project")) {
      let project = JSON.parse(
        localStorage.getItem(localStorage.getItem("project"))
      );
      project.todos.splice(project.todos[object.index], 1);
      localStorage.setItem(project.title, JSON.stringify(project));
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
  currentProject.textContent = "Main page";
  localStorage.removeItem("project");
  for (let i = 0; i < localStorage.length; i++) {
    try {
      let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
      if (item.type == "project" || localStorage.key(i) == "project") {
        continue;
      }
      content.appendChild(createTodo(item));
    } catch (Error) {
      // not needed?
      console.error(Error);
      continue;
    }
  }
});

function createProject(object) {
  let p = document.createElement("p");
  let li = document.createElement("li");
  let btn = document.createElement("button");
  btn.textContent = "X";
  btn.setAttribute("hidden", "");
  btn.addEventListener("click", (Event) => {
    Event.stopPropagation();
    clearContent();
    projectList.removeChild(li);
    localStorage.removeItem(object.title);
    localStorage.removeItem("project");
    currentProject.textContent = "Main page";
    for (let i = 0; i < localStorage.length; i++) {
      try {
        let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (item.type == "project" || localStorage.key(i) == "project") {
          continue;
        }
        content.appendChild(createTodo(item));
      } catch (Error) {
        // not needed?
        console.error(Error);
        continue;
      }
    }
    /* mainProject.dispatchEvent(); */ // how the hell its done? new Event is not working. because of this i need to repeat code above.
  });
  li.appendChild(p);
  li.appendChild(btn);
  p.textContent = object.title;
  li.addEventListener("click", () => {
    clearContent();
    localStorage.setItem("project", p.textContent);
    JSON.parse(
      localStorage.getItem(localStorage.getItem("project"))
    ).todos.forEach((todo) => {
      content.appendChild(createTodo(todo));
    });
    currentProject.textContent = p.textContent;
  });

  li.addEventListener("mouseover", () => {
    li.lastChild.removeAttribute("hidden")
  })

  li.addEventListener('mouseleave', () => {
    li.lastChild.setAttribute("hidden", "");
  })

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
  projectList.appendChild(createProject(project));
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
  if (localStorage.getItem("project")) {
    let project = JSON.parse(
      localStorage.getItem(localStorage.getItem("project"))
    ); // its 12 pm im not even going to question it
    project.todos.push(todo);
    todo.index = project.todos.indexOf(todo);
    localStorage.setItem(project.title, JSON.stringify(project));
  }
  localStorage.setItem(todo.title, JSON.stringify(todo));
});

function clearContent() {
  while (content.lastChild) {
    content.removeChild(content.lastChild);
  }
}

export { createTodo, createProject };
