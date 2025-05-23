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
const dialogTodoDescription = document.querySelector("#description");
const dialogTodoDescLabel = document.querySelector(".desc-label");
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

const checkboxInput = document.querySelector("#checklist");
checkboxInput.addEventListener("click", ()=>{
  if (checkboxInput.checked){
    dialogTodoDescription.setAttribute("hidden", "");
    dialogTodoDescLabel.setAttribute("hidden", "");
  } else {
    dialogTodoDescription.removeAttribute("hidden");
    dialogTodoDescLabel.removeAttribute("hidden");
  };
});

let inputsTodo = document.querySelectorAll(".form-todo > input");
inputsTodo = Array.from(inputsTodo);
inputsTodo.push(prioTextInput);

const removeCompletedBtn = document.querySelector(".btn-remove-completed");
removeCompletedBtn.addEventListener("click", () => {
  let deleted = [];
  let projects = [];

  for (let i = 0; i < localStorage.length; i++) {
    let item = JSON.parse(localStorage.getItem(localStorage.key(i)));

    if (localStorage.key(i) == "project") continue;

    if (item.completed) deleted.push(item.id);

    if (item.type == "project") projects.push(item);
  };

  deleted.forEach((todo)=>{
    projects.forEach((project)=>{
      if(project.todos.includes(todo)){
        project.todos.splice(project.todos.indexOf(todo), 1);
        localStorage.setItem(project.id, JSON.stringify(project));
      };
    })
    localStorage.removeItem(todo);
  });
  
  location.reload();
});

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
    let todoElement = null;
    if (item.timestamp){
      todoElement = sortDues(item.timestamp, item);
    } else {
      todoElement = content.appendChild(createTodo(item));
    }
    if (item.type == "checklist"){
      populateChecks(item, todoElement);
    }
  }
  contentAll.forEach((content)=>{
    if (content.lastChild) content.parentElement.removeAttribute("hidden");
  })
});

function createTodo(object) {
  let div = document.createElement("div");
  let h2 = document.createElement("h2");
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
    let parent = div.parentElement;
    div.parentElement.removeChild(div);

    if (parent.lastChild === null) {
      if (parent.parentElement === projectDiv) {
        parent.setAttribute("hidden", "");
      } else {
        parent.parentElement.setAttribute("hidden", "");
      };
    };
    
    localStorage.removeItem(object.id);
    if (object.project){
      let project = JSON.parse(localStorage.getItem(object.project));
      project.todos.splice(object.index, 1);
      localStorage.setItem(project.id, JSON.stringify(project));
    }
  });

  div.appendChild(h2);
  div.appendChild(footer);

  if (object.type == "checklist"){
    let container = document.createElement("div");
    let addCheck = document.createElement("button");
    addCheck.textContent = "+";
    addCheck.addEventListener("click", ()=>{
      let div = document.createElement("div");
      let checkbox = document.createElement("input");
      let label = document.createElement("label");
      let textInput = document.createElement("input");
      textInput.setAttribute("type", "text");
      textInput.style.width = "200px";
      textInput.addEventListener("blur", ()=>{
        label.textContent = textInput.value.trim();
        if (label.textContent == ""){
          checkbox.remove();
          div.remove();
          label.remove();
          return;
        };
        textInput.remove();
        object.checks.forEach(array => {
          if (!array.includes(checkbox.id)) return;
          array[0] = label.textContent;
        })
        localStorage.setItem(object.id, JSON.stringify(object));
      });
      textInput.addEventListener("keydown", (Event) => {
        if (Event.key === "Enter"){
          label.textContent = textInput.value.trim();
          if (label.textContent == "") return;
          textInput.remove();
          object.checks.forEach(array => {
            if (!array.includes(checkbox.id)) return;
            array[0] = label.textContent;
          })
          localStorage.setItem(object.id, JSON.stringify(object));
        }
      })
      checkbox.setAttribute("type", "checkbox");
      checkbox.id = generateId();
      label.setAttribute("for", checkbox.id);
      div.appendChild(checkbox);
      div.appendChild(textInput);
      div.appendChild(label);
      div.classList.add("checkbox-container");
      container.appendChild(div);
      object.checks.push([label.textContent, checkbox.id, checkbox.checked]);

      checkbox.addEventListener("click", ()=>{ 
        object.checks.forEach(array => {
          if (!array.includes(checkbox.id)) return;
          array[2] = checkbox.checked;
        })
        localStorage.setItem(object.id, JSON.stringify(object));
      });

      localStorage.setItem(object.id, JSON.stringify(object));
    });
    container.appendChild(addCheck);
    div.insertBefore(container, footer);
  } else {
    let p = document.createElement("p");
    p.textContent = object.description;
    div.insertBefore(p, footer);

    // adding ability to edit fields
    p.addEventListener("click", ()=>{
      p.setAttribute("hidden", "");

      let pInput = document.createElement("textarea");

      pInput.style.minHeight = "300px"
      pInput.style.maxHeight = "322px"
      pInput.style.marginTop = "8px"

      pInput.value = object.description;

      pInput.addEventListener("blur", () => {
        if (pInput.value.trim() == "") {
          p.removeAttribute("hidden");
          pInput.remove();
          return;
        };
        object.description = pInput.value.trim();
        pInput.remove();
        p.textContent = object.description;
        p.removeAttribute("hidden");
        localStorage.setItem(object.id, JSON.stringify(object));
      })

      div.insertBefore(pInput, p);  
    })
  }

  h2.addEventListener("click", ()=>{
    h2.setAttribute("hidden", "");

    let h2Input = document.createElement("input");

    h2Input.setAttribute("type", "text");

    h2Input.style.height = "28px"

    h2Input.value = object.title;

    h2Input.addEventListener("blur", () => {
      if (h2Input.value.trim() == "") {
        h2.removeAttribute("hidden");
        h2Input.remove();
        return;
      }
      object.title = h2Input.value.trim();
      h2Input.remove();
      h2.textContent = object.title;
      h2.removeAttribute("hidden");
      localStorage.setItem(object.id, JSON.stringify(object));
    })

    div.insertBefore(h2Input, h2);
  })

  prioSpan.addEventListener("click", ()=>{
    prioSpan.setAttribute("hidden", "");

    let prioInput = document.createElement("input");
    let prioColor = document.createElement("input");

    prioInput.setAttribute("type", "text");
    prioColor.setAttribute("type", "color");
    prioColor.style.height = "20px"

    prioInput.value = object.priority;
    prioColor.value = object.priorityColor;

    prioInput.addEventListener("blur", () => { // todo: if we click on color input while prioInput is focused, blur is triggered (unwanted effect)
      if (prioInput.value.trim() == "") {
        prioSpan.removeAttribute("hidden");
        prioInput.remove();
        prioColor.remove();
        return;
      }
      object.priority = prioInput.value.trim();
      object.priorityColor = prioColor.value;
      prioInput.remove();
      prioColor.remove();
      prioSpan.textContent = object.priority;
      if (object.priorityColor != "#000000") {
        prioSpan.style.backgroundColor = object.priorityColor;
      }
      prioSpan.removeAttribute("hidden");
      localStorage.setItem(object.id, JSON.stringify(object));
    })

    footer.insertBefore(prioInput, prioSpan);
    footer.insertBefore(prioColor, prioSpan);
  });

  dueSpan.addEventListener("click", ()=>{
    dueSpan.setAttribute("hidden", "");

    let dueInput = document.createElement("input");
    dueInput.setAttribute("type", "datetime-local");
    dueInput.value = object.timestamp;

    dueInput.addEventListener("blur", () => {
      if (dueInput.value == "") {
        dueSpan.removeAttribute("hidden");
        dueInput.remove();
        return;
      };
      object.timestamp = dueInput.value;
      object.dueDate = getDate(object.timestamp);
      dueSpan.textContent = object.dueDate;
      dueInput.remove();
      dueSpan.removeAttribute("hidden");
      if (!compareAsc(object.timestamp, CURRENT_TIME) != 1) object.expired = false;
      contentAll.forEach((element)=>{
        clearContent(element);
      })
      totalPageLayout();
      contentAll.forEach((element)=>{
        if (element === content) return;
        if (element.lastChild) {
          element.parentElement.removeAttribute("hidden");
        } else {
          element.parentElement.setAttribute("hidden", "");
        }
      })
      localStorage.setItem(object.id, JSON.stringify(object));
    });

    footer.insertBefore(dueInput, dueSpan);
  });

  h2.textContent = object.title;
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
  btn.addEventListener("click", (Event) => { // todo: since when does it not deletes all of the todos in the project?
    Event.stopPropagation();
    contentAll.forEach((element)=>{
      clearContent(element);
    })
    projectList.removeChild(li);
    object.todos.forEach((todo)=>{
      localStorage.removeItem(todo);
    })
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
    
    // i should probably rewrite this
    JSON.parse(
      localStorage.getItem(localStorage.getItem("project"))
    ).todos.forEach((id) => {
      let todoElement = null;
      if (JSON.parse(localStorage.getItem(id)).timestamp){
        todoElement = sortDues(JSON.parse(localStorage.getItem(id)).timestamp, JSON.parse(localStorage.getItem(id)));
      } else {
        todoElement = content.appendChild(createTodo(JSON.parse(localStorage.getItem(id))));
      }
      if (JSON.parse(localStorage.getItem(id)).type == "checklist"){
        populateChecks(JSON.parse(localStorage.getItem(id)), todoElement)
      }
    });
    currentProject.textContent = p.textContent;

    contentAll.forEach((element)=>{
      if (element === content) return;
      if (element.lastChild) {
        element.parentElement.removeAttribute("hidden");
      } else {
        element.parentElement.setAttribute("hidden", "");
      }

    })
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
  dialogTodoDescription.removeAttribute("hidden");
  dialogTodoDescLabel.removeAttribute("hidden");
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
    checkboxInput.checked = false;
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
  let type = "todo";

  let timestamp = dateInput.value;
  if (dateInput.value == "") {
    timestamp = null;
  }

  inputsTodo.forEach((node) => {
    array.push(node.value);
    node.value = "";
  });

  array[2] = getDate(timestamp);

  if (checkboxInput.checked) {
    type = "checklist";
    checkboxInput.checked = false;
  };

  let todo = new Todo(array[0], array[1], array[2], array[3], type);
  todo.priorityColor = prioColorInput.value;
  prioColorInput.value = "";

  todo.timestamp = timestamp;

  if (timestamp === null && todo.type == "todo") todo.type = "note"; // useless as of now (and probably will remain)

  todo.id = generateId();

  if (todo.type == "checklist"){
    todo.checks = [];
  }

  let todoElement = null;

  if (todo.timestamp){
    todoElement = sortDues(timestamp, todo);
  } else {
    todoElement = content.appendChild(createTodo(todo));
  }

  todoElement.parentElement.parentElement.removeAttribute("hidden"); // i hate myself
 
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
    return contentDueExpired.appendChild(createTodo(todo));
  } else if (isSameDay(timestamp, CURRENT_TIME)){
    return contentDueToday.appendChild(createTodo(todo));
  } else if (isSameWeek(timestamp, CURRENT_TIME)){
    if (isTomorrow(timestamp)){
      return contentDueTomorrow.appendChild(createTodo(todo));
    } else {
      return contentDueWeek.appendChild(createTodo(todo));
    }
  } else if (isSameMonth(timestamp, CURRENT_TIME)){
    return contentDueMonth.appendChild(createTodo(todo));
  } else {
    return contentDueLater.appendChild(createTodo(todo));
  }
}

// generate a unique id and use it to reference the object
function generateId(){
  let id = Math.random().toString();
  id = id.split(".");
  id = id[1];

  return id;
}

function populateChecks(item, todoElement){
  item.checks.forEach(array => {
    if (array[0] === "") {
      item.checks.splice(item.checks.indexOf(array), 1);
      localStorage.setItem(item.id, JSON.stringify(item));
      return;
    }

    let div = document.createElement("div");
    let checkbox = document.createElement("input");
    let label = document.createElement("label");
    checkbox.setAttribute("type", "checkbox");
    label.textContent = array[0];
    checkbox.id = array[1];
    checkbox.checked = array[2];
    label.setAttribute("for", checkbox.id);

    checkbox.addEventListener("click", ()=>{ 
      item.checks.forEach(array => {
        if (!array.includes(checkbox.id)) return;
        array[2] = checkbox.checked;
      })
      localStorage.setItem(item.id, JSON.stringify(item));
    });

    div.appendChild(checkbox);
    div.appendChild(label);
    div.classList.add("checkbox-container");
    todoElement.insertBefore(div, todoElement.lastChild);
  });
}

// im so lost in those
function totalPageLayout(){
  for (let i = 0; i < localStorage.length; i++) {
    let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (item.type == "project") {
      projectList.appendChild(createProject(item));
      continue;
    } else if (localStorage.key(i) == "project"){
      continue;
    }
  
    let todoElement = null;
  
    if (item.timestamp){
      item.dueDate = getDate(item.timestamp);
      if(compareAsc(item.timestamp, CURRENT_TIME) != 1){
        item.expired = true; 
        localStorage.setItem(item.id, JSON.stringify(item));
      };
      todoElement = sortDues(item.timestamp, item)
    } else {
      todoElement = content.appendChild(createTodo(item));
    } 
    todoElement.parentElement.parentElement.removeAttribute("hidden");
  
    if (item.type == "checklist"){
      populateChecks(item, todoElement)
    }
  }
}

export { createTodo, createProject, getDate, sortDues, populateChecks, totalPageLayout, contentAll};
