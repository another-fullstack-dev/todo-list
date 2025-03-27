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
        object.completed = true;
        div.style.opacity = 0.5;
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
        let array = []
        inputs.forEach((node)=>{
            array.push(node.value);
            node.value = '';
        });
        let todo = new Todo(array[0],array[1],array[2],array[3]);
        content.appendChild(createTodo(todo));
        localStorage.setItem(todo.title, JSON.stringify(todo));
    } catch {
        alert('Please enter a title'); // todo: remove this
    }
});

export {createTodo};