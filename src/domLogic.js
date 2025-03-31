import { dummytodo, Todo } from "./index";

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
}

const dialogCreateTodo = document.querySelector('dialog');
const addTodoBtn = document.querySelector('.add');
const closeModal = document.querySelector('.close');
addTodoBtn.addEventListener('click', () => {
    dialogCreateTodo.showModal();
});
closeModal.addEventListener('click', () => {
    dialogCreateTodo.close();
    inputs.forEach((node)=>{
        node.value = '';
    });
})

const inputs = document.querySelectorAll('form > input');

const todoForm = document.querySelector('form');
todoForm.addEventListener('submit', () => {
    try {
        let array = [];
        inputs.forEach((node)=>{
            array.push(node.value);
            node.value = '';
        });
        let todo = new Todo(array[0],array[1],array[2],array[3]);
        let element = createTodo(todo)
        content.appendChild(element);
        localStorage.setItem(todo.title, JSON.stringify(todo)); // does it belong here? also removes the prototype of Todo class
    } catch {
        alert('Please enter a title'); // todo: remove this
    }
});

export {createTodo};