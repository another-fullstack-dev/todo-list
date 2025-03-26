import "./styles.css";
import { createTodo } from "./domLogic";

const content = document.querySelector('#content');

class Todo {
    constructor(title, description = '', dueDate = '', priority = '') {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
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