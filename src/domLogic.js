import { content, projectDiv, projectList, Todo, Project } from "./index";

function createTodo(object) {
    let div = document.createElement('div');
    let h2 = document.createElement('h2');
    let p = document.createElement('p');
    let footer = document.createElement('footer');
    let dueSpan = document.createElement('span');
    let prioSpan = document.createElement('span');
    let completedBtn = document.createElement('button');
    let removeBtn = document.createElement('button');

    footer.appendChild(dueSpan);
    footer.appendChild(prioSpan);
    footer.appendChild(completedBtn);
    footer.appendChild(removeBtn);
    
    completedBtn.addEventListener('click', () => {
        if (object.completed){
            return;
        };
        object.completed = true;
        div.style.opacity = 0.5;
        localStorage.setItem(object.title, JSON.stringify(object));
    })
    
    removeBtn.addEventListener('click', () => {
        content.removeChild(div);
        localStorage.removeItem(object.title);
    })

    div.appendChild(h2);
    div.appendChild(p);
    div.appendChild(footer);

    h2.textContent = object.title;
    p.textContent = object.description;
    dueSpan.textContent = object.dueDate;
    prioSpan.textContent = object.priority;
    completedBtn.textContent = "Mark as completed"
    removeBtn.textContent = "X";

    if (object.completed){
        div.style.opacity = 0.5;
    }

    div.classList.add('todo')

    return div;
};

const dialogCreateTodo = document.querySelector('.dialog-todo');
const dialogCreateProject = document.querySelector('.dialog-project');
const addTodoBtn = document.querySelector('.add');
const addProjectBtn = document.querySelector('.btn-add-project');
const closeModal = document.querySelectorAll('.close');
const inputsTodo = document.querySelectorAll('.form-todo > input');
const inputsProject = document.querySelectorAll('.form-project > input');
const inputs = document.querySelectorAll('form > input');

function createProject(object){
    let p = document.createElement('p');
    p.textContent = object._title;
    
    return p;
};

addTodoBtn.addEventListener('click', () => {
    dialogCreateTodo.showModal();
});

addProjectBtn.addEventListener('click', () => {
    dialogCreateProject.showModal();
})

closeModal.forEach((button) => {
    button.addEventListener('click', () => {
        button.parentElement.parentElement.parentElement.close(); // ok
        inputs.forEach((node)=>{
        node.value = '';
    });
    })
})

const projectForm = document.querySelector('.form-project');
projectForm.addEventListener('submit', () => {
    try {
        let array = [];
        inputsProject.forEach((node)=>{
            array.push(node.value);
            node.value = '';
        });
        let project = new Project(array[0]);
        projectList.appendChild(createProject(project));
        let projects = JSON.parse(localStorage.getItem("projectBin"));
        projects.push(project);
        localStorage.setItem("projectBin", JSON.stringify(projects));
    } catch {
        if(Error.message == "Please enter a title"){
            alert('Please enter a title'); // todo: remove this
        } else {
            alert('Something went wrong');
        };
    }
});

const todoForm = document.querySelector('.form-todo');
todoForm.addEventListener('submit', () => {
    try {
        let array = [];
        inputsTodo.forEach((node)=>{
            array.push(node.value);
            node.value = '';
        });
        let todo = new Todo(array[0],array[1],array[2],array[3]);
        content.appendChild(createTodo(todo));
        localStorage.setItem(todo.title, JSON.stringify(todo));
    } catch {
        if(Error.message == "Please enter a title"){
            alert('Please enter a title'); // todo: remove this
        } else {
            alert('Something went wrong');
        };
    }
});

export { createTodo, createProject };