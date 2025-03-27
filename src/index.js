import "./styles.css";
import { createTodo } from "./domLogic";

const content = document.querySelector('#content');
const addTodoBtn = document.querySelector('.add');

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
            console.error("Please enter a title.");
            return;
        }
        this._title = value;
    }

    get title(){
        return this._title;
    }
};

// lol
function dummytodo(){
    let bob = new Todo("joe", "jooo baiden", "yesterday", "omegadontcare");
    console.log(bob);
    content.appendChild(createTodo(bob));
    return bob;
};dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();

export { dummytodo };