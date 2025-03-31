/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  F: () => (/* binding */ Todo)
});

// UNUSED EXPORTS: dummytodo

;// ./src/domLogic.js


function domLogic_createTodo(object) {
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
        let element = domLogic_createTodo(todo)
        content.appendChild(element);
        localStorage.setItem(todo.title, JSON.stringify(todo)); // does it belong here? also removes the prototype of Todo class
    } catch {
        alert('Please enter a title'); // todo: remove this
    }
});


;// ./src/index.js



const src_content = document.querySelector('#content');

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

for (let i = 0; i < localStorage.length; i++){
    let item = JSON.parse((localStorage.getItem(localStorage.key(i)))); // even if i set the prototype of Todo get and set still wont work. i dont get it.
    item.title = item._title; // this works but im pretty sure it is NOT how its done. this IS a bandaid solution.
    src_content.appendChild(domLogic_createTodo(item));
}

function dummytodo(){
    let bob = new Todo("joe", "jooo baiden", "yesterday", "omegadontcare");
    console.log(bob);
    src_content.appendChild(createTodo(bob));
    return bob;
};/* dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo();dummytodo(); */


/******/ })()
;
//# sourceMappingURL=main.js.map